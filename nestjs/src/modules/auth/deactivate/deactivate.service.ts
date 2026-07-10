import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType, User } from '@prisma/generated/browser';
import { verify } from 'argon2';
import type { Request } from 'express';
import { Secret, TOTP } from 'otpauth';
import { PrismaService } from '@/core/prisma/prisma.service';
import { MailService } from '@/modules/libs/mail/mail.service';
import { generateToken } from '@/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/shared/utils/session-metadata.util';
import { destroySession } from '@/shared/utils/session.util';
import { DeactivateAccountInput } from './inputs/deactivate-account.input';

export interface DeactivateAccountResult {
  user?: User | null;
  message?: string;
}

@Injectable()
export class DeactivateService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  public async requestDeactivate(
    request: Request,
    user: User,
    userAgent: string,
  ): Promise<boolean> {
    const token = await generateToken(
      this.prismaService,
      user,
      TokenType.DEACTIVATE_ACCOUNT,
      true,
    );

    const metadata = getSessionMetadata(request, userAgent);

    try {
      await this.mailService.sendDeactivateToken(user.email, token, metadata);
    } catch {
      throw new BadRequestException(
        'Deactivation email could not be sent. Check mail configuration or try again later.',
      );
    }

    return true;
  }

  public async deactivateAccount(
    request: Request,
    input: DeactivateAccountInput,
    userAgent: string,
  ): Promise<DeactivateAccountResult> {
    const { email, password, pin } = input;

    const userId = request.session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.email !== email) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    if (user.isTotpEnabled && !pin) {
      await this.requestDeactivate(request, user, userAgent);
      return {
        user: null,
        message:
          'Deactivation confirmation email sent. Check your inbox to confirm.',
      };
    }

    const deactivatedUser = await this.validateDeactivateToken(request, pin);

    return {
      user: deactivatedUser,
      message: 'Account deactivated',
    };
  }

  public async deactivate(request: Request, token: string): Promise<User> {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.DEACTIVATE_ACCOUNT,
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

    const user = await this.prismaService.user.findUnique({
      where: { id: existingToken.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.token.delete({
      where: { id: existingToken.id },
    });

    return this.deactivateUser(request, user);
  }

  private async validateDeactivateToken(
    request: Request,
    pin?: string,
  ): Promise<User> {
    const userId = request.session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isTotpEnabled) {
      if (!pin) {
        throw new BadRequestException('TOTP required');
      }

      if (!user.totpSecret) {
        throw new BadRequestException('TOTP is not configured');
      }

      const totp = new TOTP({
        issuer: 'Twitch',
        label: user.email,
        secret: Secret.fromBase32(user.totpSecret),
        digits: 6,
        algorithm: 'SHA1',
      });
      const delta = totp.validate({ token: pin });
      if (delta === null) {
        throw new BadRequestException('Invalid TOTP token');
      }
    }

    return this.deactivateUser(request, user);
  }

  private async deactivateUser(request: Request, user: User): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isDeactivated: true,
        deactivatedAt: new Date(),
      },
    });

    await destroySession(request, this.configService);

    return updatedUser;
  }
}
