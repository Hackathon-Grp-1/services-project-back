import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityFilteredListResults, getEntityFilteredList } from '@paginator/paginator.service';
import { Password } from '@src/auth/helpers/password.utils';
import { In, Repository } from 'typeorm';
import { CreateUserDto, FormattedCreatedUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserQueryFilterDto } from '../dto/user/user-query-filter.dto';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { RoleNotFoundException, UserEmailAlreadyExistsException } from '../helpers/exceptions/user.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
}
