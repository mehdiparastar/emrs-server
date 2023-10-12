import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginCredentialsDto {
    @IsEmail()
    @ApiProperty({ default: 'm.parastar@udb.ir' })
    email: string;

    @IsString()
    @ApiProperty({ default: '123456' })
    password: string;
}