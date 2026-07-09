import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsPasswordMatchingConstraint } from '@/shared/decorators/is-password-matching-constraint';

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  public token: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Validate(IsPasswordMatchingConstraint)
  public passwordConfirmation: string;
}
