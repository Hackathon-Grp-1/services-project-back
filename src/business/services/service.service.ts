import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../../users/helpers/exceptions/user.exception';
import { UserService } from '../../users/services/user.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { Service } from '../entities/service.entity';

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

    const service = new Service();
    Object.assign(service, {
      ...rest,
      userId: user,
      organization: organization || undefined,
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

    Object.assign(service, {
      ...rest,
      userId,
      organization: organization !== undefined ? organization : service.organization,
    });

    return this.serviceRepository.save(service);
  }

  async findAll() {
    return await this.serviceRepository.find({});
  }

  async findAllIa() {
    return await this.serviceRepository.find({
      select: [
        'firstName',
        'lastName',
        'organization',
        'hourlyRate',
        'skills',
        'domains',
        'shortProfessionalDescription',
        'shortSkillsDescription',
      ],
    });
  }

  async findAllByUser(userId: number): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { userId },
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new BadRequestException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByType(type: 'human_provider' | 'ai_agent'): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { serviceType: type },
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
