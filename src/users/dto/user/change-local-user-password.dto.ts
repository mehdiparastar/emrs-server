import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


export class ChangeLocalUserPasswordDto {
  @IsString()
  @ApiProperty({ default: '654321' })
  password: string;
}
