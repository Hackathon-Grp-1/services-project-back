import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@src/common/services/mailer.service';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { CreateUserDto } from '@src/users/dto/user/create-user.dto';
import { UserDeactivateException, UserEmailAlreadyExistsException } from '@src/users/helpers/exceptions/user.exception';
import { UserService } from '@src/users/services/user.service';
import { RoleType } from '@src/users/types/role.types';
import { randomBytes } from 'crypto';
import { ContactDto } from '../dtos/contact.dto';
import { CreateUserRequestDto } from '../dtos/create-user-request.dto';
import { ApiKey } from '../helpers/api-key.utils';
import {
  EmailNotConfirmedException,
  InvalidApiKeyException,
  InvalidCredentialsException,
} from '../helpers/auth.exception';
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
      // Check if email is confirmed
      if (!user.emailConfirmed) {
        throw new EmailNotConfirmedException();
      }

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
   * Creates a new user request and sends validation email.
   * @param createUserRequestDto The registration request data
   * @returns Success message
   */
  async createUserRequest(createUserRequestDto: CreateUserRequestDto): Promise<{ message: string }> {
    // Check if email already exists
    const isUserExists = await this.userService.emailAlreadyExists(createUserRequestDto.email);
    if (isUserExists) {
      throw new UserEmailAlreadyExistsException();
    }

    // Generate validation token
    const token = randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token temporarily (you might want to use Redis or a temporary table in production)
    // For now, we'll create a temporary user record that will be activated upon confirmation
    const createUserDto: CreateUserDto = {
      firstName: createUserRequestDto.firstName,
      lastName: createUserRequestDto.lastName,
      email: createUserRequestDto.email,
      password: createUserRequestDto.password,
      phoneNumber: createUserRequestDto.phoneNumber,
      confirmPassword: createUserRequestDto.confirmPassword,
      role: RoleType.CUSTOMER,
    };

    // Create user with emailConfirmed = false and store the token
    const user = await this.userService.createWithToken(createUserDto, token, tokenExpires);

    // Send validation email
    await this.sendAccountValidationEmail(user, token);

    return {
      message:
        'Un email de validation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et cliquer sur le lien de validation pour activer votre compte.',
    };
  }

  /**
   * Sends account validation email to the user.
   */
  private async sendAccountValidationEmail(user: any, token: string): Promise<void> {
    const validationLink = `${this.configService.get('front_url')}/email-validation?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validation de Votre Compte</title>
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
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
          .greeting {
            margin-bottom: 25px;
            color: #495057;
            font-size: 16px;
          }
          .validate-button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
            transition: all 0.3s ease;
          }
          .validate-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
          }
          .info-box {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #28a745;
          }
          .info-box h3 {
            margin: 0 0 10px 0;
            color: #155724;
            font-size: 16px;
            font-weight: 600;
          }
          .info-box ul {
            margin: 0;
            padding-left: 20px;
            color: #155724;
          }
          .info-box li {
            margin-bottom: 5px;
          }
          .welcome-notice {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            color: #0c5460;
          }
          .welcome-notice h4 {
            margin: 0 0 10px 0;
            color: #0c5460;
            font-size: 14px;
            font-weight: 600;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
          }
          .expiry-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            color: #856404;
          }
          .expiry-info strong {
            color: #856404;
          }
          @media only screen and (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 4px;
            }
            .header, .content {
              padding: 20px;
            }
            .validate-button {
              display: block;
              width: 100%;
              box-sizing: border-box;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bienvenue ! Validez Votre Compte</h1>
            <p>Votre demande d'inscription a été reçue</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Bonjour ${user.firstName} ${user.lastName},
            </div>
            
            <p>Merci de vous être inscrit ! Pour finaliser votre inscription et activer votre compte, veuillez valider votre adresse email en cliquant sur le bouton ci-dessous :</p>
            
            <div style="text-align: center;">
              <a href="${validationLink}" class="validate-button">
                ✅ Valider Mon Compte
              </a>
            </div>
            
            <div class="expiry-info">
              <strong>⏰ Ce lien expirera dans 24 heures</strong><br>
              Pour des raisons de sécurité, veuillez valider votre compte dans ce délai.
            </div>
            
            <div class="info-box">
              <h3>📋 Que se passe-t-il ensuite ?</h3>
              <ul>
                <li>Cliquez sur le bouton "Valider Mon Compte" ci-dessus</li>
                <li>Votre compte sera immédiatement activé</li>
                <li>Vous pourrez vous connecter et accéder à tous nos services</li>
                <li>Vous recevrez un email de confirmation</li>
              </ul>
            </div>
            
            <div class="welcome-notice">
              <h4>🌟 Bienvenue dans notre communauté !</h4>
              <p>Nous sommes ravis de vous accueillir. Une fois votre compte validé, vous aurez accès à toutes nos fonctionnalités et pourrez commencer à utiliser nos services immédiatement.</p>
            </div>
            
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #28a745; font-size: 12px; background-color: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #e9ecef;">
              ${validationLink}
            </p>
          </div>
          
          <div class="footer">
            <p>Ceci est un message automatique de votre système d'inscription.</p>
            <p>Si vous avez des questions, veuillez contacter notre équipe de support.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
VALIDATION DE VOTRE COMPTE
==========================

Bonjour ${user.firstName} ${user.lastName},

Merci de vous être inscrit ! Pour finaliser votre inscription et activer votre compte, veuillez valider votre adresse email en utilisant le lien ci-dessous :

${validationLink}

INFORMATIONS IMPORTANTES :
- Ce lien expirera dans 24 heures
- Pour des raisons de sécurité, veuillez valider votre compte dans ce délai

QUE SE PASSE-T-IL ENSUITE :
1. Cliquez sur le lien ci-dessus
2. Votre compte sera immédiatement activé
3. Vous pourrez vous connecter et accéder à tous nos services
4. Vous recevrez un email de confirmation

BIENVENUE DANS NOTRE COMMUNAUTÉ !
Nous sommes ravis de vous accueillir. Une fois votre compte validé, vous aurez accès à toutes nos fonctionnalités et pourrez commencer à utiliser nos services immédiatement.

---
Ceci est un message automatique de votre système d'inscription.
Si vous avez des questions, veuillez contacter notre équipe de support.
    `;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Validation de Votre Compte - Action Requise',
      html: htmlContent,
      text: textContent,
    });
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
