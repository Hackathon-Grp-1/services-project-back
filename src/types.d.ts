import { LoggedUser } from './auth/types/logged-user.type';

declare module 'express' {
  interface Request {
    user?: LoggedUser;
  }
}
