import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ContactDto {
  @ApiProperty({
    description: 'First name of the person contacting',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the person contacting',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Email address of the person contacting',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number of the person contacting (optional)',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    description: 'Subject of the contact message',
    example: 'General Inquiry',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  @ApiProperty({
    description: 'Message content',
    example: 'I would like to inquire about your services...',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}
