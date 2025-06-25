import { input, password as inquirerPassword, select } from '@inquirer/prompts';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ActivityLog } from '@src/activity-logger/entities/activity-logger.entity';
import { Resources } from '@src/activity-logger/types/resource.types';
import { ApiKey } from '@src/auth/helpers/api-key.utils';
import { Password } from '@src/auth/helpers/password.utils';
import { HttpMethod } from '@src/common/types/http.types';
import { Role } from '@src/users/entities/role.entity';
import { User } from '@src/users/entities/user.entity';
import { RoleType } from '@src/users/types/role.types';
import { UserType } from '@src/users/types/user.types';
import { DataSource } from 'typeorm';
import { CliModule } from './script.module';

const createUser = async () => {
  const start = Date.now();
  const appContext = await NestFactory.createApplicationContext(CliModule);
  const logger = new Logger('CREATE USER');

  try {
    const dataSource = appContext.get(DataSource);
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const activityLogRepository = dataSource.getRepository(ActivityLog);

    const firstName = await input({ message: 'First name : ', default: 'admin', required: true });
    const lastName = await input({ message: 'Last name : ', default: 'Admin', required: true });
    const userType = await select({
      message: 'Type',
      choices: [
        {
          name: 'Email / password',
          value: UserType.INTERNAL,
        },
        {
          name: 'Api key',
          value: UserType.API,
        },
      ],
    });

    const email =
      userType === UserType.INTERNAL
        ? await input({
            message: 'Email : ',
            default: 'admin@admin.com',
            required: true,
            validate: async (input) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(input)) return 'Please enter a valid email address';
              const existingUser = await userRepository.findOne({ where: { email: input } });
              return !existingUser || 'Email already exists';
            },
          })
        : undefined;
    const password =
      userType === UserType.INTERNAL
        ? await inquirerPassword({
            message: 'Password : ',
            mask: '*',
            validate: (input) => (input.length > 0 ? true : 'Password is required'),
          })
        : undefined;
    const hashedPassword = password ? Password.hash(password) : undefined;

    const apiKeyClear = ApiKey.generate();
    const apiKey = userType === UserType.API ? ApiKey.hash(apiKeyClear) : undefined;

    const roleType = await select({
      message: 'Role',
      choices: [
        {
          name: 'Administrator',
          value: RoleType.ADMINISTRATOR,
        },
        {
          name: 'Business man',
          value: RoleType.ENTREPRENEUR,
        },
        {
          name: 'Customer',
          value: RoleType.CUSTOMER,
        },
      ],
    });

    const role = await roleRepository.findOne({ where: { type: roleType } });
    if (!role) {
      throw new Error(`Role type not found : ${roleType}`);
    }

    const createdUser = await userRepository.save({
      firstName,
      lastName,
      type: userType,
      email,
      password: hashedPassword,
      apiKey,
      role,
    });
    await activityLogRepository.save({
      method: HttpMethod.POST,
      uri: 'development script',
      statusCode: 201,
      duration: Date.now() - start,
      resourceName: Resources.USER,
      resourceId: createdUser.id.toString(),
      description: 'Create user from development script',
    });
    logger.verbose(
      `User successfully created and have id ${createdUser.id}.${userType === UserType.API ? `Api key : ${apiKeyClear}` : ''}`,
    );
  } catch (error) {
    logger.error(`Error during creation of the user : ${error instanceof Error ? error.message : 'unknown error'}`);
  } finally {
    await appContext.close();
  }
};

void createUser();
