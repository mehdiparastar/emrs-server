import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

import { CreatePermissionRequestDto } from './create-permission-request.dto';
import { permissionRequestResultEnum } from '../../../enum/permissionRequestResult.enum';

export class UpdatePermissionRequestDto extends PartialType(
  CreatePermissionRequestDto,
) {
  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'desc' })
  adminMsg?: string;

  @IsEnum(permissionRequestResultEnum)
  @IsString()
  result: string;

  @IsOptional()
  approver?: User;
}
