import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRoles } from '../../../enum/userRoles.enum';


export class UserRolesDto {
  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.superUser]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.admin]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.doctorsAdmin]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.doctorsHL]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.doctorsML]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.doctorsLL]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.patientsAdmin]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.patientsHL]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.patientsML]?: boolean;

  @Expose()
  @ApiProperty({ default: false })
  [UserRoles.patientsLL]?: boolean;
}
