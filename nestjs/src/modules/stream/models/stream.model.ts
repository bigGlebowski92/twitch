import { Field, ObjectType } from '@nestjs/graphql';
import { Stream } from '@prisma/generated/browser';
import { UserModel } from '@/modules/auth/account/models/user.model';
import { CategoryModel } from '@/modules/category/models/category.model';
import { ChatMessageModel } from '@/modules/chat/models/chat-message.model';

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => String)
  public id!: string;

  @Field(() => String)
  public title!: string;

  @Field(() => String, { nullable: true })
  public thumbnailUrl!: string | null;

  @Field(() => String, { nullable: true })
  public ingressId!: string | null;

  @Field(() => String, { nullable: true })
  public serverUrl!: string | null;

  @Field(() => String, { nullable: true })
  public streamKey!: string | null;

  @Field(() => Boolean)
  public isLive!: boolean;

  @Field(() => Boolean)
  public isChatEnabled!: boolean;

  @Field(() => Boolean)
  public isChatFollowersOnly!: boolean;

  @Field(() => Boolean)
  public isChatPremiumFollowersOnly!: boolean;

  @Field(() => [ChatMessageModel], { nullable: true })
  public chatMessages?: ChatMessageModel[];

  @Field(() => String, { nullable: true })
  public categoryId!: string | null;

  @Field(() => CategoryModel, { nullable: true })
  public category?: CategoryModel | null;

  @Field(() => String, { nullable: true })
  public userId!: string | null;

  @Field(() => UserModel, { nullable: true })
  public user?: UserModel | null;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;
}
