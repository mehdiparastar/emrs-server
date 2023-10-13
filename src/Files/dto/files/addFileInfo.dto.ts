import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddFileInfoDto {
    @IsString()
    @ApiProperty({ default: 'filename' })
    name: string;

    @ApiProperty({ default: true })
    private: boolean;

    @IsString()
    @ApiProperty({ default: 'filehash' })
    fileHash: string;

    @IsString()
    @ApiProperty({ default: 'dicom' })
    type: string;

    @IsNumber()
    @ApiProperty({ default: 100 })
    size: number;

    @IsNumber()
    @ApiProperty({ default: 1 })
    totalSegments: number;
}
