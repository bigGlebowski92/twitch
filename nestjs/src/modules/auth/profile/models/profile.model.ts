import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfileModel {
  @Field(() => String)
  public id!: string;

  @Field(() => String)
  public username!: string;

  @Field(() => String)
  public displayName!: string;

  @Field(() => String, { nullable: true })
  public avatar!: string;

  @Field(() => String, { nullable: true })
  public bio!: string;

  @Field(() => Boolean)
  public isVerified!: boolean;

  @Field(() => Date)
  public createdAt!: Date;
}
