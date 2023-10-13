import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { UserDto } from 'src/users/dto/user/user.dto';

export class FileDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  type: string;

  @Expose()
  @ApiProperty()
  fileHash: string;

  @Expose()
  @ApiProperty()
  size: number;

  @Expose()
  @ApiProperty()
  totalSegments: number;

  @Expose()
  @ApiProperty()
  uploadedComplete: boolean;

  @Expose()
  @ApiProperty()
  private: boolean;

  @Expose()
  @ApiProperty()
  streamable: boolean;

  @Expose()
  @ApiProperty()
  @IsDate()
  createdAt?: Date;

  @Expose()
  @ApiProperty()
  @IsDate()
  updatedAt?: Date;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  owner: UserDto;
}
