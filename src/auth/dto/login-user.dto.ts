import { OmitType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';

export class LoginUserDto extends OmitType(RegisterUserDto, [
  'displayName',
] as const) {
  email: string;
  password: string;
}
