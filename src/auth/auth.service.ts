import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const hashedPassword = hashSync(registerUserDto.password, genSaltSync());
    return await this.userService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });
  }

  async validateUser(email: User['email'], password: User['password']) {
    const user = await this.userService.findUserBy({ email });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const { password: hashedPassword, ...other } = user;
    const isPasswordMatching = compareSync(password, hashedPassword);
    if (!isPasswordMatching)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return other;
  }
}
