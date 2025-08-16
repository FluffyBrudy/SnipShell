import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User display name',
    example: 'john_doe',
    minLength: 3,
    maxLength: 32,
    pattern: '^[a-zA-Z0-9_]+$'
  })
  @IsString()
  @Length(3, 32)
  displayName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    minLength: 6,
    maxLength: 32,
    format: 'email'
  })
  @IsEmail()
  @Length(6, 32)
  email: string;

  @ApiProperty({
    description: 'User password (must be strong)',
    example: 'StrongP@ss123',
    minLength: 8,
    maxLength: 16,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
  })
  @IsStrongPassword()
  @Length(8, 16)
  password: string;
}
