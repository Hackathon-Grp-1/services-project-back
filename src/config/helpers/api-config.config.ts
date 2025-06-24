import { config } from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  config({ path: `${process.cwd()}/.env-test` });
} else {
  config({ path: `${process.cwd()}/.env` });
}

const configuration = () => ({
  node_env: process.env.NODE_ENV ?? 'dev',

  api_version: process.env.API_VERSION ?? '1',
  port: parseInt(process.env.PORT ?? '3007', 10),
  app_url: process.env.APP_URL ?? 'http://localhost:3007',

  sql_logging: ['true', undefined].includes(process.env.POSTGRES_LOGGING),
  default_limit: parseInt(process.env.PAGINATION_DEFAULT_LIMIT ?? '15', 10),

  databases: {
    postgres: {
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      name: process.env.POSTGRES_NAME ?? 'services',
      synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
    },
  },

  jwt: {
    duration: parseInt(process.env.JWT_DURATION ?? '3600'),
    secret: process.env.JWT_SECRET ?? '',
  },
});

export default configuration;
