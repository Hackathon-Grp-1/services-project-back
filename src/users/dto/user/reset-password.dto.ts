import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'token123...' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newStrongPassword123!' })
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
