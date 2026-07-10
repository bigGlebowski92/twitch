import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import type { SessionMetadata } from '@/shared/types/session-metadata.types';
import { AccountDeletionTemplate } from './templates/account-deletion.template';
import { DeactivateTemplate } from './templates/deactivate.template';
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

  public async sendDeactivateToken(
    email: string,
    token: string,
    metadata: SessionMetadata,
  ): Promise<void> {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
    const html: string = await render(
      DeactivateTemplate({ domain, token, metadata }),
    );
    await this.sendMail(email, 'Deactivate your account', html);
  }

  public async sendAccountDeletionConfirmation(
    email: string,
    username: string,
  ): Promise<void> {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGINS');
    const html: string = await render(
      AccountDeletionTemplate({ domain, username, email }),
    );
    await this.sendMail(email, 'Your account has been deleted', html);
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
