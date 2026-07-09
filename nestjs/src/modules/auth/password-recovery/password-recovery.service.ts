import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TokenType } from '@prisma/generated/browser';
import { hash } from 'argon2';
import type { Request } from 'express';
import { PrismaService } from '@/core/prisma/prisma.service';
import { MailService } from '@/modules/libs/mail/mail.service';
import { NewPasswordInput } from '@/modules/libs/mail/templates/new-password.input';
import { generateToken } from '@/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/shared/utils/session-metadata.util';
import { ResetPasswordInput } from './inputs/reset-password.input';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(
    request: Request,
    input: ResetPasswordInput,
    userAgent: string,
  ): Promise<boolean> {
    const { email } = input;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = await generateToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET,
      true,
    );

    const metadata = getSessionMetadata(request, userAgent);

    try {
      await this.mailService.sendPasswordResetToken(
        user.email,
        resetToken,
        metadata,
      );
    } catch {
      throw new BadRequestException(
        'Password reset email could not be sent. Check mail configuration or try again later.',
      );
    }

    return true;
  }

  public async setNewPassword(input: NewPasswordInput): Promise<boolean> {
    const { token, password } = input;
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
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

    await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: {
        password: await hash(password),
      },
    });

    await this.prismaService.token.delete({
      where: { id: existingToken.id },
    });

    return true;
  }
}
