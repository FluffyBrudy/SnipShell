import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
  Res,
  Req,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './decorators/auth.decorator';
import { type Request, type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createAuthDto: RegisterUserDto) {
    const user = await this.authService.register(createAuthDto);
    if (user.kind === 'SUCCESS') return { user };
    throw new ConflictException(user.error);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const { error, kind, user } =
      await this.authService.validateUser(loginUserDto);
    if (kind === 'ERROR') throw new UnauthorizedException(error);
    const { refreshToken, accessToken } = this.authService.login(
      user.id,
      user.email,
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    response.json({ accessToken });
  }

  @Public()
  @HttpCode(200)
  @Post('refresh-token')
  refreshToken(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['refreshToken'] as string | undefined;
    if (!token) throw new BadRequestException('no refresh token found');
    const { kind, error, payload } = this.authService.verifyRefreshToken(token);
    console.log(payload);
    if (kind === 'ERROR') throw new UnauthorizedException(error);
    const { refreshToken, accessToken } = this.authService.login(
      payload.sub,
      payload.email,
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    response.json({ accessToken });
  }
}
