import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { SwaggerFailureResponse } from '@src/common/helpers/common-set-decorators.helper';
import { CreateAutomatedServiceDto } from '../dto/create-automated-service.dto';
import { AutomatedService } from '../entities/automated-service.entity';
import { AutomatedServicesService } from '../services/automated-services.service';

@ApiTags('Automated Services')
@SwaggerFailureResponse()
@Controller({ path: 'automated-services', version: ['1'] })
export class AutomatedServicesController {
  constructor(private readonly automatedServicesService: AutomatedServicesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiResponse({
    status: 201,
    type: AutomatedService,
    description: 'Create a new automated service',
  })
  async create(@Body() createAutomatedServiceDto: CreateAutomatedServiceDto): Promise<AutomatedService> {
    return this.automatedServicesService.create(createAutomatedServiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiResponse({
    status: 200,
    type: [AutomatedService],
    description: 'Get all automated services',
  })
  async findAll(): Promise<AutomatedService[]> {
    return this.automatedServicesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: AutomatedService,
    description: 'Get an automated service by ID',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AutomatedService> {
    return this.automatedServicesService.findOneById(id);
  }
}
