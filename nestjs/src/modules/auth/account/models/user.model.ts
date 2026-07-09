import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/generated/browser';

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

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}
