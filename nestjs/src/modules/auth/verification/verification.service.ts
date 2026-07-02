import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenType, User } from '@prisma/generated/browser';
import type { Request } from 'express';
import { generateToken } from '@/shared/utils/generate-token.util';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { getSessionMetadata } from '../../../shared/utils/session-metadata.util';
import { saveSession } from '../../../shared/utils/session.util';
import { VerificationInput } from './input/verification.input';

@Injectable()
export class VerificationService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async verify(
    request: Request,
    input: VerificationInput,
    userAgent: string,
  ): Promise<User> {
    const { token } = input;

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.EMAIL_VERIFICATION,
      },
    });

    if (!existingToken) {
      throw new BadRequestException('Invalid token');
    }

    if (existingToken.expiresIn < Math.floor(Date.now() / 1000)) {
      throw new BadRequestException('Token has expired');
    }

    if (!existingToken.userId) {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: {
        isEmailVerified: true,
        isVerified: true,
      },
    });

    await this.prismaService.token.delete({
      where: { id: existingToken.id },
    });

    const metadata = getSessionMetadata(request, userAgent);
    await saveSession(request, user, metadata);

    return user;
  }

  public async sendVerificationEmail(user: User) {
    await generateToken(
      this.prismaService,
      user,
      TokenType.EMAIL_VERIFICATION,
      true,
    );
    return true;
  }
}
