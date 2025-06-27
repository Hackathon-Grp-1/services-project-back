import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAutomatedServiceDto } from '../dto/create-automated-service.dto';
import { AutomatedService } from '../entities/automated-service.entity';
import { AutomatedServiceNotFoundException } from '../helpers/exceptions/automated-service.exception';

@Injectable()
export class AutomatedServicesService {
  constructor(
    @InjectRepository(AutomatedService)
    private readonly automatedServiceRepository: Repository<AutomatedService>,
  ) {}

  async findAll(): Promise<AutomatedService[]> {
    return await this.automatedServiceRepository.find({});
  }

  async findOneById(id: number): Promise<AutomatedService> {
    const automatedService = await this.automatedServiceRepository.findOneBy({ id });
    if (!automatedService) {
      throw new AutomatedServiceNotFoundException({ id });
    }
    return automatedService;
  }

  async create(createAutomatedServiceDto: CreateAutomatedServiceDto): Promise<AutomatedService> {
    const automatedService = this.automatedServiceRepository.create(createAutomatedServiceDto);
    return await this.automatedServiceRepository.save(automatedService);
  }
}
