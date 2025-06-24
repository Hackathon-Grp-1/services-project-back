import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, FormattedCreatedUserDto } from '@src/users/dto/user/create-user.dto';
import { UserService } from '@src/users/services/user.service';
import { RoleType } from '@src/users/types/role.types';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { InvalidCredentialsException } from '../helpers/auth.exception';
import { Password } from '../helpers/password.utils';
import { LoggedUserWithToken } from '../types/logged-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async singIn(email: string, password: string): Promise<LoggedUserWithToken> {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (user && Password.compare(password, user.password)) {
      const payload = { userId: user.id, username: user.email };
      const { password: _, ...returnUser } = user;
      return {
        accessToken: this.jwtService.sign(payload),
        user: returnUser,
      };
    }

    throw new InvalidCredentialsException();
  }

  /**
   * Creates a new user based on the registration request.
   * @param createUserRequestDto The registration request data
   * @returns The created user without sensitive information
   */
  async createUserRequest(createUserRequestDto: CreateUserRequestDto): Promise<FormattedCreatedUserDto> {
    // Create user
    const createUserDto: CreateUserDto = {
      firstName: createUserRequestDto.firstName,
      lastName: createUserRequestDto.lastName,
      email: createUserRequestDto.email,
      password: createUserRequestDto.password,
      phoneNumber: createUserRequestDto.phoneNumber,
      confirmPassword: createUserRequestDto.confirmPassword,
      role: RoleType.CUSTOMER,
    };

    return await this.userService.create(createUserDto);
  }
}
