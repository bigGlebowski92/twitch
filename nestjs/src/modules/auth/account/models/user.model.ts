import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/generated/browser';
import { FollowModel } from '@/modules/follow/models/follow.model';
import {
  NotificationModel,
  NotificationSettingsModel,
} from '@/modules/notification/models/notification-settings.model';
import { StreamModel } from '@/modules/stream/models/stream.model';
import { SocialLinkModel } from '../../profile/models/social-link.model';

@ObjectType()
export class UserModel implements User {
  @Field(() => String)
  public id: string;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public password: string;

  @Field(() => String)
  public username: string;

  @Field(() => String)
  public displayName: string;

  @Field(() => String, { nullable: true })
  public avatar: string;

  @Field(() => String, { nullable: true })
  public bio: string;

  @Field(() => Boolean)
  public isVerified: boolean;

  @Field(() => Boolean)
  public isEmailVerified: boolean;

  @Field(() => Boolean)
  public isTotpEnabled: boolean;

  @Field(() => String, { nullable: true })
  public totpSecret: string | null;

  @Field(() => Boolean)
  public isDeactivated: boolean;

  @Field(() => Date, { nullable: true })
  public deactivatedAt: Date | null;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;

  @Field(() => StreamModel, { nullable: true })
  public stream?: StreamModel | null;

  @Field(() => [SocialLinkModel], { nullable: true })
  public socialLinks?: SocialLinkModel[];

  @Field(() => [FollowModel], { nullable: true })
  public followings?: FollowModel[];

  @Field(() => [FollowModel], { nullable: true })
  public followers?: FollowModel[];

  @Field(() => String, { nullable: true })
  public telegramId: string | null;

  @Field(() => [NotificationModel], { nullable: true })
  public notifications?: NotificationModel[];

  @Field(() => [NotificationSettingsModel], { nullable: true })
  public notificationSettings?: NotificationSettingsModel[];
}
