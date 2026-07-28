import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class FiltersInput {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  public take?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  public skip?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public searchTerm?: string;
}
