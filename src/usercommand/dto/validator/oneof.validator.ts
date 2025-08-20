import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object;
    const excludedKeys: string[] = (args.constraints as string[]) || [];
    const keys = Object.keys(obj).filter((k) => !excludedKeys.includes(k));
    return keys.some((key) => obj[key] !== undefined && obj[key] != null);
  }

  defaultMessage(args: ValidationArguments) {
    const excludedKeys = args.constraints?.join(', ') || '';
    return `At least one field besides [${excludedKeys}] must be defined`;
  }
}

export function AtLeastOneField(
  excludedKeys: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: CallableFunction) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object,
      propertyName: '',
      options: validationOptions,
      constraints: excludedKeys,
      validator: AtLeastOneFieldConstraint,
    });
  };
}
