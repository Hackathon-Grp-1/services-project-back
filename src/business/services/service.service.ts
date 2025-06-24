import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../../users/helpers/exceptions/user.exception';
import { UserService } from '../../users/services/user.service';
import { CreateServiceDto } from '../dto/create-service.dto';
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
    let orgEntity: Organization | undefined = undefined;
    if (organization) {
      const foundOrg = await this.serviceRepository.manager.findOne(Organization, { where: { id: organization } });
      if (!foundOrg) throw new OrganizationNotFoundException({ id: organization });
      orgEntity = foundOrg;
    }
    const service = this.serviceRepository.create({
      ...rest,
      user: userEntity,
      organization: orgEntity,
    });
    return this.serviceRepository.save(service);
  }

  async findAllByUser(userId: number): Promise<Service[]> {
    return this.serviceRepository.find({ where: { user: { id: userId } }, relations: ['user', 'organization'] });
  }
}
