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
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const { user, organization, ...rest } = createServiceDto;

    // Check user
    const userEntity = await this.userService.findOneById(user);
    if (!userEntity) throw new UserNotFoundException({ id: user });

    // Check organization if provided
    // let orgEntity: Organization | undefined = undefined;
    // if (organization) {
    //   const foundOrg = await this.serviceRepository.manager.findOne(Organization, { where: { id: organization } });
    //   if (!foundOrg) throw new OrganizationNotFoundException({ id: organization });
    //   orgEntity = foundOrg;
    // }

    const service = this.serviceRepository.create({
      ...rest,
      userId: user,
      // organization: orgEntity,
      domain: Array.isArray(rest.domain)
        ? rest.domain
        : typeof rest.domain === 'string'
          ? rest.domain.split(',').map((d: string) => d.trim())
          : [],
      localization: rest.localization,
    });
    return this.serviceRepository.save(service);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new BadRequestException(`Service with ID ${id} not found`);
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
      domain: rest.domain
        ? Array.isArray(rest.domain)
          ? rest.domain
          : rest.domain.split(',').map((d: string) => d.trim())
        : service.domain,
      localization: rest.localization ?? service.localization,
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
        'domain',
        'shortProfessionalDescription',
        'shortSkillsDescription',
      ],
    });
  }

  async findAllByUser(userId: number): Promise<Service[]> {
    return await this.serviceRepository.find({
      where: { userId },
      relations: ['organization'],
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!service) {
      throw new BadRequestException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByType(type: 'human_provider' | 'ai_agent'): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { serviceType: type },
      relations: ['organization'],
    });
  }
}
