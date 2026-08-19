import { Field, ObjectType } from '@nestjs/graphql';
import type {
  Notification,
  NotificationSettings,
} from '@prisma/generated/browser';
import { NotificationType } from '@prisma/generated/browser';
import { registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UserModel } from '@/modules/auth/account/models/user.model';

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class NotificationModel implements Notification {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  @Field(() => String)
  public message: string;

  @Field(() => NotificationType)
  public type: NotificationType;

  @Field(() => Boolean)
  public isRead: boolean;

  @Field(() => String, { nullable: true })
  public userId: string | null;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  @Field(() => Boolean)
  public siteNotifications: boolean;

  @Field(() => Boolean)
  public telegramNotifications: boolean;

  @Field(() => UserModel, { nullable: true })
  public user?: UserModel | null;

  @Field(() => String, { nullable: true })
  @IsUUID()
  public userId: string | null;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

@ObjectType()
export class ChangeNotificationsSettingsOutput {
  @Field(() => NotificationSettingsModel)
  public notificationSettings: NotificationSettingsModel;

  @Field(() => String, { nullable: true })
  public telegramAuthToken?: string;
}
