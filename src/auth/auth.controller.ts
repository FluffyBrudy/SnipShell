import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { PublicRoute } from './decorators/auth.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @PublicRoute()
  async register(@Body() registerUserDto: RegisterUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } =
      await this.authService.registerUser(registerUserDto);
    return safeUser;
  }

  @Post('login')
  @PublicRoute()
  login(@Body() loginUserDto: Omit<RegisterUserDto, 'displayName'>) {
    const user = this.authService.loginUser(loginUserDto);
    return user;
  }
}
