import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityFilteredListResults, getEntityFilteredList } from '@paginator/paginator.service';
import { Password } from '@src/auth/helpers/password.utils';
import { MailerService } from '@src/common/services/mailer.service';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { randomBytes } from 'crypto';
import { In, Repository } from 'typeorm';
import { CreateUserDto, FormattedCreatedUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserQueryFilterDto } from '../dto/user/user-query-filter.dto';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { RoleNotFoundException, UserEmailAlreadyExistsException } from '../helpers/exceptions/user.exception';
import { UserType } from '../types/user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly mailerService: MailerService,
    private readonly configService: ApiConfigService,
  ) {}

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto - Data transfer object containing user creation details.
   * @returns {Promise<FormattedCreatedUserDto>} A promise that resolves to the created user details.
   * @throws {UserEmailAlreadyExistsException} If a user with the given email already exists.
   * @throws {RoleNotFoundException} If the specified role does not exist.
   */
  async create(createUserDto: CreateUserDto): Promise<FormattedCreatedUserDto> {
    const isUserExists = await this.emailAlreadyExists(createUserDto.email);
    if (isUserExists) throw new UserEmailAlreadyExistsException({ email: createUserDto.email });

    // Get role
    const role = await this.roleRepository.findOneBy({ type: createUserDto.role });
    if (!role) throw new RoleNotFoundException({ type: createUserDto.role });

    // Hash password
    const hashedPassword = Password.hash(createUserDto.password);

    // construct object
    const creatingUser = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      password: hashedPassword,
      role: role,
    });

    const createdUser = await this.userRepository.save(creatingUser);

    const { password: _, ...user } = createdUser;

    return user;
  }

  /**
   * Checks if a user with the given email already exists.
   *
   * @param {string} email - The email to check for existence.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the email exists, otherwise `false`.
   */
  async emailAlreadyExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email }, withDeleted: true });
    return count > 0;
  }

  /**
   * Retrieves a list of users based on query filters.
   *
   * @param {UserQueryFilterDto} filters - Filters to apply to the user query.
   * @returns {Promise<EntityFilteredListResults<User>>} A promise that resolves to the filtered list of users.
   */
  async findAll(query: UserQueryFilterDto): EntityFilteredListResults<User> {
    const [users, totalResults] = await getEntityFilteredList({
      repository: this.userRepository,
      queryFilter: query,
      withDeleted: true,
      relations: [{ relation: 'role', alias: 'r' }],
    });
    return [users, users.length, totalResults];
  }

  async findAllApiKey(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'firstName',
        'apiKey',
        'createdAt',
        'deletedAt',
        'email',
        'id',
        'lastName',
        'password',
        'phoneNumber',
        'type',
        'updatedAt',
      ],
      relations: { role: true },
      where: { type: UserType.API },
      withDeleted: true,
    });
  }

  /**
   * Retrieves a user by ID.
   *
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the user entity.
   * @throws {Error} If the user does not exist.
   */
  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id }, relations: ['role'], withDeleted: true });
  }

  /**
   * Finds a user by their email, including their password.
   *
   * @param {string} email - The email of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user entity with the password, or null if not found.
   */
  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect([
        'user.id',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.password',
      ])
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .withDeleted()
      .getOne();
  }

  async findManyById(ids: number[]): Promise<User[]> {
    return await this.userRepository.find({ where: { id: In(ids) } });
  }

  /**
   * Updates an existing user.
   *
   * @param {number} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - Data transfer object containing updated user details.
   * @returns {Promise<User | null>} A promise that resolves to the updated user entity.
   * @throws {Error} If the user does not exist.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const { email, password, role } = updateUserDto;
    if (email) {
      const existingUser = await this.userRepository.findOneBy({ email });
      if (existingUser && existingUser.id !== id) {
        throw new UserEmailAlreadyExistsException({ email });
      }
    }

    const hashedPassword = password ? Password.hash(password) : undefined;
    const dbRole = role ? ((await this.roleRepository.findOneBy({ type: role })) ?? undefined) : undefined;

    await this.userRepository.update(id, { ...updateUserDto, password: hashedPassword, role: dbRole });
    return this.findOneById(id);
  }

  /**
   * Archives a user by setting their status to inactive or archived.
   *
   * @param {number} id - The ID of the user to archive.
   * @returns {Promise<void>} A promise that resolves when the user is archived.
   * @throws {Error} If the user does not exist.
   */
  async archiveUser(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  /**
   * Restores an archived user by setting their status to active.
   *
   * @param {number} id - The ID of the user to restore.
   * @returns {Promise<void>} A promise that resolves when the user is restored.
   * @throws {Error} If the user does not exist.
   */
  async restoreUser(id: number): Promise<void> {
    await this.userRepository.restore(id);
  }

  /**
   * Démarre la procédure de reset password : génère un token, construit un lien et envoie le mail.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) return; // Ne pas révéler si l'email existe

    // Générer un token temporaire (à stocker en BDD ou cache dans une vraie app)
    const token = randomBytes(32).toString('hex');
    // Stocker le token et sa date d'expiration pour l'utilisateur
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await this.userRepository.save(user);

    // Construire le lien de reset
    const resetLink = `${this.configService.get('app_url')}/forgot-password?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demande de Réinitialisation de Mot de Passe</title>
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
          .greeting {
            margin-bottom: 25px;
            color: #495057;
            font-size: 16px;
          }
          .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
          }
          .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
          }
          .info-box {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #ffc107;
          }
          .info-box h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 16px;
            font-weight: 600;
          }
          .info-box ul {
            margin: 0;
            padding-left: 20px;
            color: #856404;
          }
          .info-box li {
            margin-bottom: 5px;
          }
          .security-notice {
            background-color: #d1ecf1;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
            color: #0c5460;
          }
          .security-notice h4 {
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
            .reset-button {
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
            <h1>🔐 Demande de Réinitialisation de Mot de Passe</h1>
            <p>Nous avons reçu une demande de réinitialisation de votre mot de passe</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Bonjour ${user.firstName} ${user.lastName},
            </div>
            
            <p>Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Si vous êtes à l'origine de cette demande, veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="reset-button">
                🔑 Réinitialiser Mon Mot de Passe
              </a>
            </div>
            
            <div class="expiry-info">
              <strong>⏰ Ce lien expirera dans 1 heure</strong><br>
              Pour des raisons de sécurité, veuillez compléter votre réinitialisation de mot de passe dans ce délai.
            </div>
            
            <div class="info-box">
              <h3>📋 Que se passe-t-il ensuite ?</h3>
              <ul>
                <li>Cliquez sur le bouton "Réinitialiser Mon Mot de Passe" ci-dessus</li>
                <li>Vous serez redirigé vers une page sécurisée pour saisir votre nouveau mot de passe</li>
                <li>Votre nouveau mot de passe sera immédiatement actif</li>
                <li>Vous pourrez ensuite vous connecter avec votre nouveau mot de passe</li>
              </ul>
            </div>
            
            <div class="security-notice">
              <h4>🔒 Avis de Sécurité</h4>
              <p>Si vous n'êtes pas à l'origine de cette demande de réinitialisation de mot de passe, veuillez ignorer cet email. Votre mot de passe restera inchangé. Pour une sécurité supplémentaire, vous pourriez vouloir changer votre mot de passe lors de votre prochaine connexion.</p>
            </div>
            
            <p>Si le bouton ci-dessus ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px; background-color: #f8f9fa; padding: 10px; border-radius: 4px; border: 1px solid #e9ecef;">
              ${resetLink}
            </p>
          </div>
          
          <div class="footer">
            <p>Ceci est un message automatique de votre système de sécurité de compte.</p>
            <p>Si vous avez des questions, veuillez contacter notre équipe de support.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
DEMANDE DE RÉINITIALISATION DE MOT DE PASSE
===========================================

Bonjour ${user.firstName} ${user.lastName},

Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Si vous êtes à l'origine de cette demande, veuillez utiliser le lien ci-dessous pour créer un nouveau mot de passe :

${resetLink}

INFORMATIONS IMPORTANTES :
- Ce lien expirera dans 1 heure
- Pour des raisons de sécurité, veuillez compléter votre réinitialisation de mot de passe dans ce délai

QUE SE PASSE-T-IL ENSUITE :
1. Cliquez sur le lien ci-dessus
2. Vous serez redirigé vers une page sécurisée pour saisir votre nouveau mot de passe
3. Votre nouveau mot de passe sera immédiatement actif
4. Vous pourrez ensuite vous connecter avec votre nouveau mot de passe

AVIS DE SÉCURITÉ :
Si vous n'êtes pas à l'origine de cette demande de réinitialisation de mot de passe, veuillez ignorer cet email. Votre mot de passe restera inchangé. Pour une sécurité supplémentaire, vous pourriez vouloir changer votre mot de passe lors de votre prochaine connexion.

---
Ceci est un message automatique de votre système de sécurité de compte.
Si vous avez des questions, veuillez contacter notre équipe de support.
    `;

    // Envoyer le mail
    await this.mailerService.sendMail({
      to: user.email!,
      subject: 'Demande de Réinitialisation de Mot de Passe - Action Requise',
      html: htmlContent,
      text: textContent,
    });
  }

  /**
   * Confirme la réinitialisation du mot de passe avec le token et le nouveau mot de passe.
   */
  async confirmResetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ resetPasswordToken: token });
    if (!user || !user.resetPasswordTokenExpires || user.resetPasswordTokenExpires < new Date()) {
      throw new Error('Invalid or expired token');
    }
    user.password = Password.hash(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await this.userRepository.save(user);
  }
}
