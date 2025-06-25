import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Resources } from '@src/activity-logger/types/resource.types';
import { GetUser } from '@src/auth/decorators/user.decorator';
import { ApiKeyGuard } from '@src/auth/guards/api-key.guard';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { LoggedUser } from '@src/auth/types/logged-user.type';
import { SwaggerFailureResponse } from '@src/common/helpers/common-set-decorators.helper';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { Service } from '../entities/service.entity';
import { ServiceService } from '../services/service.service';

@ApiTags(Resources.SERVICE)
@SwaggerFailureResponse()
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    status: 201,
    type: Service,
    description: 'Créer un nouveau service (prestataire humain ou agent IA)',
  })
  async create(@Body() dto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    type: [Service],
    description: 'Récupérer tous les services',
  })
  async findAll() {
    return await this.serviceService.findAll();
  }

  @UseGuards(ApiKeyGuard)
  @Get('ia')
  @ApiResponse({
    status: 200,
    type: [Service],
    description: 'Récupérer tous les services pour n8n',
  })
  async findAllIa() {
    return await this.serviceService.findAllIa();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/by-user')
  @ApiResponse({
    status: 200,
    type: [Service],
    description: "Récupérer tous les services de l'utilisateur connecté",
  })
  async findAllByUser(@GetUser() user: LoggedUser): Promise<Service[]> {
    return this.serviceService.findAllByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('type/:type')
  @ApiResponse({
    status: 200,
    type: [Service],
    description: "Récupérer tous les services d'un type spécifique",
  })
  async findByType(@Param('type') type: 'human_provider' | 'ai_agent'): Promise<Service[]> {
    return this.serviceService.findByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Service,
    description: 'Récupérer un service par son ID',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiResponse({
    status: 200,
    type: Service,
    description: 'Mettre à jour un service existant',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServiceDto): Promise<Service> {
    return this.serviceService.update(id, dto);
  }
}
