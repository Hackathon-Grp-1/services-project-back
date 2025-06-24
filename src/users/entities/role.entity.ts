import { ApiProperty } from '@nestjs/swagger';
import { TimestampEntity } from '@src/common/entities/timestamp.entity';
import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { RoleType } from '../types/role.types';
import { User } from './user.entity';

@Entity()
export class Role extends TimestampEntity {
  @ApiProperty({ description: 'Name of the role', example: 'Visiteur' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Type of the role. It use for permissions', enum: RoleType, example: RoleType.CUSTOMER })
  @Column({ type: 'enum', enum: RoleType })
  type: RoleType;

  @ApiProperty({ description: 'Description of the role', example: 'Rôle permettant uniquement la lecture de données' })
  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: Relation<User[]>;
}
