import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserDeactivateException } from '@src/users/helpers/exceptions/user.exception';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { LoggedUser } from '../types/logged-user.type';
import { AuthService } from './../services/auth.service';
import { AuthNoApiKeyException, InvalidApiKeyException } from './auth.exception';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<LoggedUser> {
    const apiKey = req.header('X-API-KEY');

    if (!apiKey) {
      throw new AuthNoApiKeyException();
    }

    const user = await this.authService.singInApiKey(apiKey);
    if (!user) {
      throw new InvalidApiKeyException({ apiKey });
    }

    if (user.deletedAt) {
      throw new UserDeactivateException({ apiKey });
    }

    return user;
  }
}
