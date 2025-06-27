import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { transformPhoneNumber } from '@src/auth/dtos/create-user-request.dto';
import { Match } from '@src/common/decorators/match-fields.decorator';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Matches } from 'class-validator';
import { Role } from '../../entities/role.entity';
import { RoleType } from '../../types/role.types';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john-doe@example.com' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'azerty123' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiPropertyOptional({ description: 'Phone number of the user', example: '+33123456789' })
  @IsString()
  @Transform(transformPhoneNumber)
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format (e.g., +33123456789)',
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'azerty123' })
  @IsNotEmpty({ message: 'confirmPassword is required' })
  @Match('password')
  confirmPassword: string;

  @ApiProperty({ description: 'Role of the user', enum: [RoleType.ENTREPRENEUR, RoleType.CUSTOMER], example: RoleType.ENTREPRENEUR })
  @IsEnum(RoleType, { message: 'Role must be ENTREPRENEUR ou CUSTOMER' })
  @IsNotEmpty()
  role: RoleType;
}

export class FormattedCreatedUserDto extends OmitType(CreateUserDto, [
  'role',
  'password',
  'confirmPassword',
  'phoneNumber',
  'email',
]) {
  role: Role | null;
  phoneNumber?: string | null;
  email?: string;
}
