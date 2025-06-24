import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { LoggedUser } from '@src/auth/types/logged-user.type';
import { CreateServiceDto } from '../dto/create-service.dto';
import { Service } from '../entities/service.entity';
import { ServiceService } from '../services/service.service';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiResponse({ status: 201, type: Service })
  async create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Service] })
  async findAllByUser(@GetUser() user: LoggedUser): Promise<Service[]> {
    return this.serviceService.findAllByUser(user.id);
  }
}
