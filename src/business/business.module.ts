import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@src/users/user.module';
import { OrganizationController } from './controllers/organization.controller';
import { ServiceController } from './controllers/service.controller';
import { Organization } from './entities/organization.entity';
import { Service as ServiceEntity } from './entities/service.entity';
import { OrganizationService } from './services/organization.service';
import { ServiceService } from './services/service.service';

@Module({
  controllers: [OrganizationController, ServiceController],
  imports: [TypeOrmModule.forFeature([Organization, ServiceEntity]), UserModule],
  providers: [OrganizationService, ServiceService],
})
export class BusinessModule {}
