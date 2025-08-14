import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(32)
  displayName: string;

  @IsEmail()
  @Length(32)
  email: string;

  @IsStrongPassword()
  @Length(16)
  password: string;
}
