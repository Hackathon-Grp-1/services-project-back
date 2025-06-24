import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, LeafTypes, Leaves } from '../types/api-config.types';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends Leaves<EnvironmentVariables>>(propertyPath: T): LeafTypes<EnvironmentVariables, T> {
    const value = this.configService.get<LeafTypes<EnvironmentVariables, T>>(propertyPath);
    if (value === undefined) {
      throw new Error(`Configuration value for ${propertyPath} is undefined`);
    }

    return value;
  }
}
