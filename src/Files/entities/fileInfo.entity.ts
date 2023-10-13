import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@Index(['fileHash', 'owner'], { unique: true })
export class FileInfo {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @Index({ unique: false })
  @ApiProperty({ default: 'file name' })
  name: string;

  @Column()
  @ApiProperty({ default: 'file type' })
  type: string;

  @Column({ type: 'bigint', comment: 'size in byte' })
  @ApiProperty({ default: 'file size' })
  size: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty()
  totalSegments: number;

  @Column({ type: 'boolean', default: false, comment: 'size in byte' })
  @ApiProperty({ default: false })
  uploadedComplete: boolean;

  @Column({ type: 'boolean', default: true, comment: 'size in byte' })
  @ApiProperty({ default: true })
  private: boolean;

  @Column()
  @ApiProperty()
  @Index({ unique: true })
  fileHash: string;

  @Column({ default: false, type: 'boolean' })
  @ApiProperty()
  streamable: boolean;

  @CreateDateColumn()
  @IsOptional()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @IsOptional()
  @ApiProperty()
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.files, { nullable: false })
  @IsOptional()
  owner: User;
}
