import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@src/common/entities/base.entity';
import { HttpMethod } from '@src/common/types/http.types';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, Relation } from 'typeorm';

@Entity()
export class ActivityLog extends BaseEntity {
  @ApiProperty({ example: '2025-04-17T08:00:00.303Z' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'External user id', nullable: true })
  @Column({ nullable: true, type: 'integer' })
  externalUserId: number | null;

  @ApiProperty({ description: 'Body of the request', nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  requestBody: string | null;

  @ApiProperty({ description: 'Body of the response', nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  responseBody: string | null;

  @ApiProperty({ description: 'IPv6 or IPv4' })
  @Column({ nullable: true, length: 45, type: 'varchar' })
  ipAddress: string | null;

  @ApiProperty({ description: 'Headers of the request', nullable: true })
  @Column({ type: 'text', nullable: true })
  headers: string | null;

  @ApiProperty({ description: 'HTTP method used in the request', example: HttpMethod.GET })
  @Column()
  method: string;

  @ApiProperty({ example: '/api/v1/users', description: 'URI of the endpoint' })
  @Column()
  uri: string;

  @ApiProperty({ description: 'HTTP status code response', example: 200 })
  @Column()
  statusCode: number;

  @ApiProperty({ description: 'Request duration in ms', example: 75 })
  @Column()
  duration: number;

  @ApiProperty({ example: 'User', description: 'Type name of the resource involved in the operation' })
  @Column()
  resourceName: string;

  @ApiProperty({ description: 'ID of the targeted resource', nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  resourceId: string | null;

  @ApiProperty({
    example: 'Reset du mot de passe utilisateur',
    description: 'Description of the endpoint function',
  })
  @Column({ nullable: true, type: 'varchar' })
  description: string | null;

  @ApiProperty({ description: 'User', type: () => User })
  @ManyToOne(() => User, (user) => user.logs, { eager: true })
  user: Relation<User>;
}
