import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { RolesGuard } from '@src/auth/guards/role.guard';
import { SwaggerFailureResponse } from '@src/common/helpers/common-set-decorators.helper';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { Organization } from '../entities/organization.entity';
import { OrganizationService } from '../services/organization.service';

@ApiTags('organizations')
@UseGuards(RolesGuard, JwtAuthGuard)
@ApiBearerAuth()
@SwaggerFailureResponse()
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiResponse({ status: 201, type: Organization })
  async create(@Body() dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Organization] })
  async findAll(): Promise<Organization[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Organization })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Organization> {
    return this.organizationService.findOne(id);
  }
}
