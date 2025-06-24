import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../../users/helpers/exceptions/user.exception';
import { UserService } from '../../users/services/user.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { Organization } from '../entities/organization.entity';
import { Service } from '../entities/service.entity';
import { OrganizationNotFoundException } from '../exceptions/organization.exception';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly userService: UserService,
  ) { }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const { user, organization, ...rest } = createServiceDto;

    // Validation spécifique au type de service
    this.validateServiceData(rest);

    // Check user
    const userEntity = await this.userService.findOneById(user);
    if (!userEntity) throw new UserNotFoundException({ id: user });

    // Check organization if provided
    let orgEntity: Organization | undefined = undefined;
    if (organization) {
      const foundOrg = await this.serviceRepository.manager.findOne(Organization, { where: { id: organization } });
      if (!foundOrg) throw new OrganizationNotFoundException({ id: organization });
      orgEntity = foundOrg;
    }

    const service = this.serviceRepository.create({
      ...rest,
      userId: user,
      organization: orgEntity,
    });
    return this.serviceRepository.save(service);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new BadRequestException(`Service with ID ${id} not found`);
    }

    // Si le type de service change, valider les nouvelles données
    if (updateServiceDto.serviceType && updateServiceDto.serviceType !== service.serviceType) {
      this.validateServiceData({ ...service, ...updateServiceDto });
    }

    const { user, organization, ...rest } = updateServiceDto;

    // Check user if provided
    let userId = service.userId;
    if (user) {
      const foundUser = await this.userService.findOneById(user);
      if (!foundUser) throw new UserNotFoundException({ id: user });
      userId = user;
    }

    // Check organization if provided
    let orgEntity = service.organization;
    if (organization !== undefined) {
      if (organization) {
        const foundOrg = await this.serviceRepository.manager.findOne(Organization, { where: { id: organization } });
        if (!foundOrg) throw new OrganizationNotFoundException({ id: organization });
        orgEntity = foundOrg;
      } else {
        orgEntity = undefined;
      }
    }

    Object.assign(service, {
      ...rest,
      userId,
      organization: orgEntity,
    });

    return this.serviceRepository.save(service);
  }

  async findAllByUser(userId: number): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { userId },
      relations: ['organization']
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['organization']
    });
    if (!service) {
      throw new BadRequestException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByType(type: 'human_provider' | 'ai_agent'): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { serviceType: type },
      relations: ['organization']
    });
  }

  private validateServiceData(data: any): void {
    if (data.serviceType === 'human_provider') {
      if (!data.firstName) {
        throw new BadRequestException('firstName is required for human providers');
      }
      if (!data.lastName) {
        throw new BadRequestException('lastName is required for human providers');
      }
      if (!data.phone) {
        throw new BadRequestException('phone is required for human providers');
      }
    } else if (data.serviceType === 'ai_agent') {
      if (!data.aiAgentName) {
        throw new BadRequestException('aiAgentName is required for AI agents');
      }
      if (!data.aiModel) {
        throw new BadRequestException('aiModel is required for AI agents');
      }
      if (!data.aiVersion) {
        throw new BadRequestException('aiVersion is required for AI agents');
      }
    }
  }
}
