import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateLocalUserDto {
  @IsEmail()
  @ApiProperty({ default: 'm.parastar@udb.ir' })
  email: string;

  @IsString()
  @ApiProperty({ default: '123456' })
  password: string;

  @IsString()
  @ApiProperty({ default: 'mehdi parastar' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: `iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjmAAAAAElFTkSuQmCC` })
  photo?: string;
}
