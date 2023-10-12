import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class ChangeLocalUserProfileDetailDto {
  @IsString()
  @ApiProperty({ default: 'mehdi__ parastar__' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ default: 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjmAAAAAElFTkSuQmCC' })
  photo?: string;
}