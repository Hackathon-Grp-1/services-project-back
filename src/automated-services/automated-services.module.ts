import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomatedServicesController } from './controllers/automated-services.controller';
import { AutomatedService } from './entities/automated-service.entity';
import { AutomatedServicesService } from './services/automated-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([AutomatedService])],
  controllers: [AutomatedServicesController],
  providers: [AutomatedServicesService],
  exports: [TypeOrmModule, AutomatedServicesService],
})
export class AutomatedServicesModule {}
