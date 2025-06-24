import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@src/common/decorators/public.decorator';
import { User as DbUser } from '@src/users/entities/user.entity';
import {
  AuthNoTokenException,
  AuthUnknownException,
  DeactivateAccountException,
  InvalidBearerTokenException,
  TokenExpiredTokenException,
} from '../helpers/auth.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<User extends DbUser>(_: Error | null, user: User | false, info?: Error) {
    if (user) {
      if (user.deletedAt) throw new DeactivateAccountException();
      return user;
    }

    if (info?.name === 'JsonWebTokenError') throw new InvalidBearerTokenException();
    if (info?.name === 'TokenExpiredError') throw new TokenExpiredTokenException();
    if (info?.name === 'Error') throw new AuthNoTokenException();

    throw new AuthUnknownException();
  }
}
