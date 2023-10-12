import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { UserRoles } from '../../../enum/userRoles.enum';


export class ApproveUserRolesDto {
  // @IsBoolean()
  // [UserRoles.superUser]?: boolean = false;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.admin]?: boolean = false;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.doctorsAdmin]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.doctorsHL]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.doctorsML]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.doctorsLL]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.patientsAdmin]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.patientsHL]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.patientsML]?: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  [UserRoles.patientsLL]?: boolean;
}
