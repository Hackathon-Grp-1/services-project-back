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
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau Message de Contact</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            padding: 30px;
          }
          .contact-info {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #667eea;
          }
          .contact-info h3 {
            margin: 0 0 15px 0;
            color: #667eea;
            font-size: 18px;
            font-weight: 600;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
            align-items: center;
          }
          .info-label {
            font-weight: 600;
            color: #555;
            min-width: 80px;
            margin-right: 10px;
          }
          .info-value {
            color: #333;
            flex: 1;
          }
          .message-section {
            background-color: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
          }
          .message-section h3 {
            margin: 0 0 15px 0;
            color: #495057;
            font-size: 18px;
            font-weight: 600;
          }
          .message-content {
            background-color: #f8f9fa;
            border-radius: 4px;
            padding: 15px;
            border-left: 3px solid #28a745;
            white-space: pre-wrap;
            line-height: 1.5;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
          }
          .timestamp {
            color: #6c757d;
            font-size: 12px;
            text-align: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 4px;
            }
            .header, .content {
              padding: 20px;
            }
            .info-row {
              flex-direction: column;
              align-items: flex-start;
            }
            .info-label {
              min-width: auto;
              margin-bottom: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Nouveau Message de Contact</h1>
            <p>Vous avez reçu un nouveau message via le formulaire de contact de votre site web</p>
          </div>
          
          <div class="content">
            <div class="contact-info">
              <h3>👤 Informations de Contact</h3>
              <div class="info-row">
                <span class="info-label">Nom :</span>
                <span class="info-value">${firstName} ${lastName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email :</span>
                <span class="info-value">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </span>
              </div>
              ${
                phone
                  ? `
              <div class="info-row">
                <span class="info-label">Téléphone :</span>
                <span class="info-value">
                  <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                </span>
              </div>
              `
                  : ''
              }
              <div class="info-row">
                <span class="info-label">Sujet :</span>
                <span class="info-value">${subject}</span>
              </div>
            </div>
            
            <div class="message-section">
              <h3>💬 Message</h3>
              <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <div class="timestamp">
              📅 Envoyé le ${new Date().toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })}
            </div>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé depuis le formulaire de contact de votre site web.</p>
            <p>Veuillez répondre directement à l'adresse email de l'expéditeur ci-dessus.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
NOUVEAU MESSAGE DE CONTACT
==========================

Informations de Contact :
------------------------
Nom : ${firstName} ${lastName}
Email : ${email}
${phone ? `Téléphone : ${phone}` : ''}
Sujet : ${subject}

Message :
---------
${message}

Envoyé le : ${new Date().toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })}

---
Cet email a été envoyé depuis le formulaire de contact de votre site web.
Veuillez répondre directement à l'adresse email de l'expéditeur ci-dessus.
    `;

    await this.mailerService.sendMail({
      to: this.configService.get('mail.admin'),
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      text: textContent,
    });

    return { message: 'Contact message sent successfully' };
  }
}
