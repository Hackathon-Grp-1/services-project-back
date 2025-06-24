import { Logger, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/custom-http-exception.filter';
import { InvalidDtoException } from './common/helpers/error-codes/custom.exception';
import { buildErrors } from './common/helpers/error-codes/validation-error.helper';
import { SwaggerConfig } from './config/helpers/swagger.config';
import { ApiConfigService } from './config/services/api-config.service';

const logger = new Logger('Registre Sécurité');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ApiConfigService);

  const PORT = configService.get('port');
  const APP_URL = configService.get('app_url');
  const APP_ROUTE_PREFIX = 'api';

  app.setGlobalPrefix(APP_ROUTE_PREFIX);
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new InvalidDtoException(buildErrors(validationErrors));
      },
    }),
  );
  app.enableCors();

  SwaggerConfig(app, configService.get('api_version'));

  await app.listen(PORT, () => logger.log(`🚀 REGISTRE DE SÉCURITÉ is running on: ${APP_URL}/${APP_ROUTE_PREFIX}`));
}

void bootstrap();
