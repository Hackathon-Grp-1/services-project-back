import { applyDecorators, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

export const ThrottleContact = () => {
  return applyDecorators(UseGuards(ThrottlerGuard));
};
