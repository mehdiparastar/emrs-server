import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionRequestDto } from './permission-request.dto';

export class PaginationPermissionRequestDto {
  @Expose()
  @ApiProperty()
  count: number;

  @Expose()
  @Type(() => PermissionRequestDto)
  @ApiProperty()
  data: PermissionRequestDto;
}
