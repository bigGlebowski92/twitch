import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { User } from '@prisma/generated/browser';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { Authorized } from '@/shared/decorators/authorized.decorator';
import { ChangeNotificationsSettingsInput } from './inputs/change-notifications-settings.input';
import {
  ChangeNotificationsSettingsOutput,
  NotificationModel,
} from './models/notification-settings.model';
import { NotificationService } from './notification.service';

@Resolver('Notification')
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Authorization()
  @Query(() => Number, { name: 'findUnreadNotificationsCount' })
  public async findUnreadNotificationsCount(@Authorized() user: User) {
    return this.notificationService.findUnreadNotificationsCount(user);
  }

  @Authorization()
  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  public async findNotificationsByUser(@Authorized() user: User) {
    return this.notificationService.findNotificationsByUser(user);
  }

  @Authorization()
  @Mutation(() => ChangeNotificationsSettingsOutput, {
    name: 'changeNotificationsSettings',
  })
  public async changeNotificationsSettings(
    @Authorized() user: User,
    @Args('data') data: ChangeNotificationsSettingsInput,
  ) {
    return this.notificationService.changeSettings(user, data);
  }
}
