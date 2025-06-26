import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLoggerModule } from './activity-logger/activity-logger.module';
import { LoggingInterceptor } from './activity-logger/helpers/activity-logger.interceptor';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { MailerService } from './common/services/mailer.service';
import { ApiConfigModule } from './config/api-config.module';
import configuration from './config/helpers/api-config.config';
import { ApiConfigService } from './config/services/api-config.service';
import { dataSourceOptions } from './orm/data-source';
import { UserModule } from './users/user.module';

const nestConfigService = new ConfigService(configuration());
const configService = new ApiConfigService(nestConfigService);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: configService.get('throttler.ttl'),
        limit: configService.get('throttler.limit'),
      },
    ]),
    TypeOrmModule.forRoot(dataSourceOptions),
    ApiConfigModule,
    UserModule,
    ActivityLoggerModule,
    AuthModule,
    BusinessModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    MailerService,
  ],
})
export class AppModule {}
