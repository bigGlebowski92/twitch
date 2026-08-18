import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMessage } from '@prisma/generated/browser';
import { UserModel } from '@/modules/auth/account/models/user.model';
import { StreamModel } from '@/modules/stream/models/stream.model';

@ObjectType()
export class ChatMessageModel implements ChatMessage {
  @Field(() => String)
  public id!: string;

  @Field(() => String)
  public content!: string;

  @Field(() => String)
  public streamId!: string;

  @Field(() => StreamModel, { nullable: true })
  public stream?: StreamModel;

  @Field(() => String)
  public userId!: string;

  @Field(() => UserModel, { nullable: true })
  public user?: UserModel;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;
}
