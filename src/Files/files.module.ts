import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileInfo } from './entities/fileInfo.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileGateway } from './file.gateway';
import { DICOMService } from './dicom.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileInfo])],
  controllers: [FilesController],
  providers: [FilesService, DICOMService, FileGateway],
})
export class FilesModule { }
