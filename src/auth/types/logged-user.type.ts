import { Role } from '@src/users/entities/role.entity';
import { User } from '@src/users/entities/user.entity';
import { RoleType } from '@src/users/types/role.types';

export interface UserWithRole extends Pick<User, 'id' | 'firstName' | 'lastName' | 'email'> {
  role: {
    id: number;
    name: string;
    type: RoleType;
  };
}

export interface LoggedUser extends Omit<User, 'password'> {
  role: Role;
}

export interface LoggedUserWithToken {
  accessToken: string;
  user: LoggedUser;
}
