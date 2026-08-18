import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public text: string;
}
