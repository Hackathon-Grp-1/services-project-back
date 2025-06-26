import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'Token de confirmation email',
    example: 'abc123def456...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
