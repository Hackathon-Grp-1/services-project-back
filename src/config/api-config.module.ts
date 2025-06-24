import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';

@Global()
@Module({
  imports: [],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
