import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@/core/prisma/prisma.service';
import { MailService } from '@/modules/libs/mail/mail.service';

@Injectable()
export class CronService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron('0 0 * * *')
  public async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lt: sevenDaysAgo,
        },
      },
    });
    for (const account of deactivatedAccounts) {
      await this.mailService.sendAccountDeletionConfirmation(
        account.email,
        account.username,
      );
    }
    await this.prismaService.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lt: sevenDaysAgo,
        },
      },
    });
  }
}
