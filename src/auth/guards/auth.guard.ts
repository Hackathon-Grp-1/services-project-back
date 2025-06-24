import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import configuration from '@src/config/helpers/api-config.config';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { UserService } from '@src/users/services/user.service';
import { Request } from 'express';
import { AuthNoTokenException } from '../helpers/auth.exception';
import { JwtPayload } from '../types/payload.types';

const nestConfigService = new ConfigService(configuration());
const configService = new ApiConfigService(nestConfigService);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AuthNoTokenException();
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: configService.get('jwt.secret'),
      });
      const user = await this.userService.findOneById(payload.userId);
      request['user'] = user!;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
