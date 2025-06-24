import { ApiProperty } from '@nestjs/swagger';

export class SwaggerLoggedUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'COMPANY' })
  role: string;
}

export class SwaggerLoggedUserWithToken {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: SwaggerLoggedUser })
  user: SwaggerLoggedUser;
}
