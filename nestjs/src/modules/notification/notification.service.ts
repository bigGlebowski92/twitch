import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/generated/browser';
import { TokenType } from '@prisma/generated/browser';
import { PrismaService } from '@/core/prisma/prisma.service';
import { generateToken } from '@/shared/utils/generate-token.util';
import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input';
import type { Notification } from '@prisma/generated/browser';

@Injectable()
export class NotificationService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findUnreadNotificationsCount(user: User): Promise<number> {
    const count = await this.prismaService.notification.count({
      where: {
        isRead: false,
        userId: user.id,
      },
    });

    return count;
  }

  public async findNotificationsByUser(user: User): Promise<Notification[]> {
    await this.prismaService.notification.updateMany({
      where: {
        isRead: false,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }

  public async changeSettings(
    user: User,
    settings: ChangeNotificationsSettingsInput,
  ) {
    const { siteNotifications, telegramNotifications } = settings;

    const notificationSettings =
      await this.prismaService.notificationSettings.update({
        where: {
          userId: user.id,
        },
        data: {
          siteNotifications,
          telegramNotifications,
        },
        include: {
          user: true,
        },
      });

    if (
      notificationSettings.telegramNotifications &&
      !notificationSettings.user?.telegramId
    ) {
      const telegramAuthToken = await generateToken(
        this.prismaService,
        user,
        TokenType.TELEGRAM_AUTH,
      );
      return {
        notificationSettings,
        telegramAuthToken,
      };
    }
    if (
      !notificationSettings.telegramNotifications &&
      notificationSettings.user?.telegramId
    ) {
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          telegramId: null,
        },
      });
      return {
        notificationSettings,
      };
    }

    return { notificationSettings };
  }
}
