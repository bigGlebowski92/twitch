import { Field, ObjectType } from '@nestjs/graphql';
import { SocialLinkModel } from './social-link.model';

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

  @Field(() => [SocialLinkModel])
  public socialLinks!: SocialLinkModel[];

  @Field(() => Date)
  public createdAt!: Date;
}
