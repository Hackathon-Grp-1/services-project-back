import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserNotFoundException } from '../../users/helpers/exceptions/user.exception';
import { UserService } from '../../users/services/user.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { Organization } from '../entities/organization.entity';
import { OrganizationNotFoundException } from '../exceptions/organization.exception';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly userService: UserService,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const { author, owner, parentOrganization, ...rest } = createOrganizationDto;
    // Check author
    const authorUser = await this.userService.findOneById(author);
    if (!authorUser) throw new UserNotFoundException({ id: author });
    // Check owner if provided
    let ownerUser: User | undefined = undefined;
    if (owner) {
      const foundOwner = await this.userService.findOneById(owner);
      if (!foundOwner) throw new UserNotFoundException({ id: owner });
      ownerUser = foundOwner;
    }
    // Check parentOrganization if provided
    let parentOrg: Organization | undefined = undefined;
    if (parentOrganization) {
      const foundParent = await this.organizationRepository.findOne({ where: { id: parentOrganization } });
      if (!foundParent) throw new OrganizationNotFoundException({ id: parentOrganization });
      parentOrg = foundParent;
    }
    const organization = this.organizationRepository.create({
      ...rest,
      author: authorUser,
      owner: ownerUser,
      parentOrganization: parentOrg,
    });
    return this.organizationRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({ relations: ['author', 'owner', 'parentOrganization'] });
  }

  async findOne(id: number): Promise<Organization> {
    const org = await this.organizationRepository.findOne({
      where: { id },
      relations: ['author', 'owner', 'parentOrganization'],
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }
}
