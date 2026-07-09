import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import type { SessionMetadata } from '@/shared/types/session-metadata.types';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template';
import { VerificationTemplate } from './templates/verification.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendVerificationToken(
    email: string,
    token: string,
  ): Promise<void> {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
    const html: string = await render(VerificationTemplate({ domain, token }));
    await this.sendMail(email, 'Verify your email', html);
  }

  public async sendPasswordResetToken(
    email: string,
    token: string,
    metadata: SessionMetadata,
  ): Promise<void> {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
    const html: string = await render(
      PasswordRecoveryTemplate({ domain, token, metadata }),
    );
    await this.sendMail(email, 'Reset your password', html);
  }

  private async sendMail(
    email: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
