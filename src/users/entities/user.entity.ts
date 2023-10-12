import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { authTypeEnum } from '../../enum/authType.enum';
import { UserPermissionRequest } from './permission-requests.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @Index({ unique: true })
  @ApiProperty()
  email: string;

  @Column({ nullable: true })
  @ApiHideProperty()
  password: string;

  @Column({ nullable: true })
  @ApiProperty()
  refreshToken: string;

  @Column({ type: 'enum', enum: authTypeEnum, default: authTypeEnum.local })
  @ApiProperty()
  provider: string;

  @Column({ nullable: true })
  @ApiProperty()
  @Index({ unique: true })
  providerId: string;

  @Column({ nullable: true })
  @ApiProperty()
  name: string;

  @Column({ type: 'longtext', nullable: true })
  @ApiProperty()
  photo: string;

  @Column('simple-array', { nullable: true })
  @ApiProperty()
  roles: string[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;

  @OneToMany(
    () => UserPermissionRequest,
    (permissionRequest) => permissionRequest.user,
    { cascade: true },
  )
  permissionRequests: UserPermissionRequest[];

  @OneToMany(
    () => UserPermissionRequest,
    (permissionRequest) => permissionRequest.user,
    { cascade: true },
  )
  approves: UserPermissionRequest[];
}
