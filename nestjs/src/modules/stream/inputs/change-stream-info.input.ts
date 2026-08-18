import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class ChangeStreamInfoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public title: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  public categoryId: string;
}
