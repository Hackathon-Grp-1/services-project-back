import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@src/users/types/role.types';

export class SwaggerLoggedUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ enum: RoleType, example: RoleType.ENTREPRENEUR })
  role: string;
}

export class SwaggerLoggedUserWithToken {
  @ApiProperty({ type: String, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: SwaggerLoggedUser })
  user: SwaggerLoggedUser;
}
