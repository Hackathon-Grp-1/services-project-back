import configuration from '@config/helpers/api-config.config';
import { ApiConfigService } from '@config/services/api-config.service';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';

const nestConfigService = new ConfigService(configuration());
const configService = new ApiConfigService(nestConfigService);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('databases.postgres.host'),
  port: configService.get('databases.postgres.port'),
  username: configService.get('databases.postgres.username'),
  password: configService.get('databases.postgres.password'),
  database: configService.get('databases.postgres.name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: configService.get('databases.postgres.synchronize') || configService.get('node_env') === 'test',
  logging: configService.get('sql_logging'),
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(dataSourceOptions);
