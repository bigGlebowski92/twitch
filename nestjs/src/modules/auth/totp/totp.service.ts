import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/generated/browser';
import { Secret, TOTP } from 'otpauth';
import * as QRCode from 'qrcode';
import { PrismaService } from '@/core/prisma/prisma.service';
import { EnableTotpInput } from './inputs/enable-totp.input';

export interface TotpGenerateResult {
  secret: string;
  qrcodeUrl: string;
}

@Injectable()
export class TotpService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async generate(user: User): Promise<TotpGenerateResult> {
    const secret = new Secret({ size: 20 });
    const totp = new TOTP({
      issuer: 'Twitch',
      label: user.email,
      secret,
      digits: 6,
      algorithm: 'SHA1',
    });

    const otpauthUrl = totp.toString();
    const qrcodeUrl = await QRCode.toDataURL(otpauthUrl);

    return { secret: secret.base32, qrcodeUrl };
  }

  public async enable(user: User, input: EnableTotpInput): Promise<boolean> {
    const { secret, pin } = input;
    const totp = new TOTP({
      issuer: 'Twitch',
      label: user.email,
      secret: Secret.fromBase32(secret),
      digits: 6,
      algorithm: 'SHA1',
    });

    const delta = totp.validate({ token: pin });
    if (delta === null) {
      throw new BadRequestException('Invalid TOTP token');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isTotpEnabled: true, totpSecret: secret },
    });

    return true;
  }

  public async disable(user: User): Promise<boolean> {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isTotpEnabled: false, totpSecret: null },
    });
    return true;
  }
}
