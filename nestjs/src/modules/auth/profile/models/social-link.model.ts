import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SocialLinkModel {
  @Field(() => String)
  public id!: string;

  @Field(() => String)
  public title!: string;

  @Field(() => String)
  public url!: string;

  @Field(() => Int)
  public position!: number;

  @Field(() => String, { nullable: true })
  public userId!: string | null;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;
}
