import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import configuration from '@src/config/helpers/api-config.config';
import { ApiConfigService } from '@src/config/services/api-config.service';
import { UserModule } from '@src/users/user.module';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './helpers/jwt.strategy';
import { AuthService } from './services/auth.service';

const nestConfigService = new ConfigService(configuration());
const configService = new ApiConfigService(nestConfigService);

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: configService.get('jwt.secret'),
      signOptions: { expiresIn: configService.get('jwt.duration') },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
