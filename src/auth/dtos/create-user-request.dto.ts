import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Match } from '@src/common/decorators/match-fields.decorator';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export const transformPhoneNumber = ({ value }: { value: string }) => {
  if (!value) return value;

  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // If it's a French number starting with 0
  if (digits.startsWith('0')) {
    return `+33${digits.slice(1)}`;
  }

  // If it's already in international format
  if (digits.startsWith('33')) {
    return `+${digits}`;
  }

  // If it's an international number
  if (value.startsWith('+')) {
    return value;
  }

  // Default case: assume it's a French number
  return `+33${digits}`;
};

export class CreateUserRequestDto {
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'Additional comments or notes', example: 'Special requirements' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number of the user', example: '+33123456789' })
  @IsString()
  @Transform(transformPhoneNumber)
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g., +33123456789)',
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'Password for the user account', example: 'StrongP@ss123' })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Confirmation of the password', example: 'StrongP@ss123' })
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
