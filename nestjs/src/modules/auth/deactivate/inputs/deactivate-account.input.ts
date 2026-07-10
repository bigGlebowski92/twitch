import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  Length,
} from 'class-validator';

@InputType()
export class DeactivateAccountInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(6, 6)
  public pin?: string;
}
