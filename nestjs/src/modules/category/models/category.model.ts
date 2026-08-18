import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { Category } from '@prisma/generated/browser';
import { StreamModel } from '@/modules/stream/models/stream.model';

@ObjectType()
export class CategoryModel implements Category {
  @Field(() => ID)
  public id!: string;

  @Field(() => String)
  public title!: string;

  @Field(() => String)
  public slug!: string;

  @Field(() => String, { nullable: true })
  public description!: string | null;

  @Field(() => String, { nullable: true })
  public thumbnailUrl!: string | null;

  @Field(() => [StreamModel], { nullable: true })
  public streams?: StreamModel[];

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;
}
