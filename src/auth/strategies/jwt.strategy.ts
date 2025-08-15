import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { TJwtPayloadSig } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate<T>(payload: TJwtPayloadSig<T>) {
    const user = await this.userService.findUserBy({ id: payload.sub });
    if (!user) return null;
    return { id: user.id, email: user.email };
  }
}
