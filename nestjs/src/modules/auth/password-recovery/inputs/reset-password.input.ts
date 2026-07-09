import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
