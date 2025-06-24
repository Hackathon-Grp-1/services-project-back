import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@src/users/user.module';
import { OrganizationController } from './controllers/organization.controller';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './services/organization.service';

@Module({
  controllers: [OrganizationController],
  imports: [TypeOrmModule.forFeature([Organization]), UserModule],
  providers: [OrganizationService],
})
export class BusinessModule {}
