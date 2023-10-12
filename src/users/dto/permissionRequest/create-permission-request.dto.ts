import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRoles } from '../../../enum/userRoles.enum';

export class CreatePermissionRequestDto {
  @IsEnum(UserRoles)
  @ApiProperty({ default: UserRoles.admin, enum: UserRoles })
  role: UserRoles;
}
