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
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBadRequestResponse, 
  ApiConflictResponse, 
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto, LoginResponseDto, RefreshTokenResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/auth.decorator';
import { type Request, type Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided credentials'
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    type: UserResponseDto
  })
  @ApiConflictResponse({ 
    description: 'User with this email already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'User with this email already exists' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['email must be an email'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async register(@Body() createAuthDto: RegisterUserDto) {
    const { kind, error, user } =
      await this.authService.register(createAuthDto);
    if (kind === 'SUCCESS') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
    throw new ConflictException(error);
  }

  @Public()
  @Post('login')
  @ApiOperation({ 
    summary: 'User login',
    description: 'Authenticates user credentials and returns access token with refresh token in cookies'
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: LoginResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['email must be an email'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Refresh access token',
    description: 'Uses refresh token from cookies to generate a new access token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token refreshed successfully',
    type: RefreshTokenResponseDto
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or expired refresh token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid refresh token' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'No refresh token found in cookies',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'no refresh token found' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
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
