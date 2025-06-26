import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@src/common/services/mailer.service';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { CreateUserDto, FormattedCreatedUserDto } from '@src/users/dto/user/create-user.dto';
import { UserDeactivateException } from '@src/users/helpers/exceptions/user.exception';
import { UserService } from '@src/users/services/user.service';
import { RoleType } from '@src/users/types/role.types';
import { ContactDto } from '../dtos/contact.dto';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { ApiKey } from '../helpers/api-key.utils';
import { InvalidApiKeyException, InvalidCredentialsException } from '../helpers/auth.exception';
import { Password } from '../helpers/password.utils';
import { LoggedUser, LoggedUserWithToken } from '../types/logged-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ApiConfigService,
  ) {}

  async singInPassword(email: string, password: string): Promise<LoggedUserWithToken> {
    const user = await this.userService.findOneByEmailWithPassword(email);
    if (user && user.password && Password.compare(password, user.password)) {
      const payload = { userId: user.id, username: user.email };
      const { password: _, ...returnUser } = user;
      return {
        accessToken: this.jwtService.sign(payload),
        user: returnUser,
      };
    }

    throw new InvalidCredentialsException();
  }

  async singInApiKey(apiKey: string): Promise<LoggedUser> {
    const users = await this.userService.findAllApiKey();

    for (const user of users) {
      if (user.apiKey && ApiKey.compare(apiKey, user.apiKey)) {
        if (user.deletedAt) {
          throw new UserDeactivateException({ apiKey });
        }

        const { apiKey: _, ...partialUser } = user;
        return partialUser;
      }
    }

    throw new InvalidApiKeyException({ apiKey });
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

  /**
   * Sends a contact form email to admin.
   * @param contactDto The contact form data
   * @returns Success message
   */
  async sendContactEmail(contactDto: ContactDto): Promise<{ message: string }> {
    const { firstName, lastName, email, phone, subject, message } = contactDto;

    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    await this.mailerService.sendMail({
      to: this.configService.get('mail.admin'),
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });

    return { message: 'Contact message sent successfully' };
  }
}
