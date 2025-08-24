import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

type Tpayload = { sub: User['id']; email: User['email'] };
type TPayloadUnion =
  | { payload: null; kind: 'ERROR'; error: string }
  | { payload: Tpayload; kind: 'SUCCESS'; error: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async validateUser(userCredentials: LoginUserDto) {
    const { email: userEmail, password } = userCredentials;

    const user = await this.userService.findUserBy({ email: userEmail });
    if (!user)
      return { kind: 'ERROR', error: 'user not found', user: null } as const;

    const passwordMatch = compareSync(password, user.password);
    if (!passwordMatch)
      return {
        kind: 'ERROR',
        error: 'invalid credentials',
        user: null,
      } as const;

    const { email, id } = user;
    return { kind: 'SUCCESS', error: null, user: { email, id } } as const;
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;
    const userExist = await this.userService.findUserBy({ email });
    if (userExist)
      return { kind: 'ERROR', error: 'user already exists' } as const;
    const hashedPassword = hashSync(password, genSaltSync());
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });
    return { kind: 'SUCCESS', error: null, user } as const;
  }

  login(id: User['id'], email: string, includeRefreshToken = true) {
    const payload = { sub: id, email: email };
    if (!includeRefreshToken) {
      return { accessToken: this.jwtService.sign(payload) };
    }
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_ACCESS_TOKEN_EXPIRES_IN',
      ),
    });
    return {
      refreshToken,
      accessToken: this.jwtService.sign(payload),
    };
  }

  verifyRefreshToken(token: string): TPayloadUnion {
    try {
      const payload = this.jwtService.verify<Tpayload>(token, {
        secret: this.configService.getOrThrow<string>(
          'JWT_REFRESH_TOKEN_SECRET',
        ),
        ignoreExpiration: false,
        ignoreNotBefore: true,
      });

      return { payload, error: '', kind: 'SUCCESS' } as const;
    } catch (error) {
      return {
        payload: null,
        error: (error as Error).message,
        kind: 'ERROR',
      } as const;
    }
  }
}
