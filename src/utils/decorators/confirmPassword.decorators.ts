import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'confirmPassword', async: false })
export class confirmPassword implements ValidatorConstraintInterface {
  validate(
    confirmPassword: string,
    args: ValidationArguments,
  ): boolean | Promise<boolean> {
    return confirmPassword === args.object['password'];
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}
