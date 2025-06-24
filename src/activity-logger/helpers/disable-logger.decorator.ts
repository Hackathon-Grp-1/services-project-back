import { SetMetadata } from '@nestjs/common';

export const DisableActivityLogger = () => SetMetadata('disableActivityLogger', true);
