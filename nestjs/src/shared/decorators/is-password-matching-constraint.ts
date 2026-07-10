import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import { NewPasswordInput } from '@/modules/auth/password-recovery/inputs/new-password.input';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  public validate(password: string, args: ValidationArguments) {
    const object = args.object as NewPasswordInput;
    return password === object.passwordConfirmation;
  }

  public defaultMessage(args: ValidationArguments) {
    const object = args.object as NewPasswordInput;
    return `Password and password confirmation do not match. You entered ${object.password} and ${object.passwordConfirmation}`;
  }
}
