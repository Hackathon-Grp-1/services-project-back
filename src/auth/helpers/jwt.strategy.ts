import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import configuration from '@src/config/helpers/api-config.config';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { UserService } from '@src/users/services/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/payload.types';
import { InvalidBearerTokenException } from './auth.exception';

const nestConfigService = new ConfigService(configuration());
const configService = new ApiConfigService(nestConfigService);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOneById(payload.userId);
    if (!user) throw new InvalidBearerTokenException();

    return user;
  }
}
