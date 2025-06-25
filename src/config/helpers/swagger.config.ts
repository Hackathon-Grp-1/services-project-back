import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const title = 'SERVICES Swagger';
const description = 'SERVICES API';

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(apiVersion)
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .addBearerAuth({ type: 'http', name: 'access_token', description: 'Set access token provided auth login route' })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'SERVICES Swagger',
    swaggerOptions: {
      tagSorter: 'alpha',
      operationsSorter: 'method',
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });
};
