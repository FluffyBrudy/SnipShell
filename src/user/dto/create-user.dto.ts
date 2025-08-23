import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
    @IsString()
  @Length(3, 32)
  displayName: string;

    @IsEmail()
  @Length(6, 32)
  email: string;

    @IsStrongPassword()
  @Length(8, 16)
  password: string;
}
