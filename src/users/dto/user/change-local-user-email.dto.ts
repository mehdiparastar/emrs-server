import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ChangeLocalUserEmailDto {
  @IsEmail()
  @ApiProperty({ default: 'm.parastar__@udb.ir' })
  email: string;
}

