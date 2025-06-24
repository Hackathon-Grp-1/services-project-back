import { SetMetadata } from '@nestjs/common';
import { RoleType } from '@src/users/types/role.types';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
