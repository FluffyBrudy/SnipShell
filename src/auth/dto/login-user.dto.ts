import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class LoginUserDto extends OmitType(RegisterUserDto, [
  'displayName',
] as const) {
  @ApiProperty({
    description: 'User email address for login',
    example: 'john.doe@example.com',
    minLength: 6,
    maxLength: 32,
    format: 'email'
  })
  email: string;

  @ApiProperty({
    description: 'User password for login',
    example: 'StrongP@ss123',
    minLength: 8,
    maxLength: 16
  })
  password: string;
}
