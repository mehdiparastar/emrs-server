import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { FileInfo } from './entities/fileInfo.entity';
import { FileGateway } from './file.gateway';
import { ConfigService } from '@nestjs/config';
import { sleep } from 'src/helperFunctions/sleep';
import { DICOMService } from './dicom.service';

@Injectable()
export class FilesService {
  private uploadPath: string;
  constructor(
    @InjectRepository(FileInfo)
    private filesInfoRepo: Repository<FileInfo>,
    private readonly dicomService: DICOMService,
    private readonly fileSocketGateway: FileGateway,
    protected configService: ConfigService<IconfigService>,
  ) {
    this.uploadPath = path.join(process.cwd(), '..', 'uploads', 'files'); // Define your upload directory
  }

  async uploads(
    files: Array<
      Express.Multer.File & {
        fileHash: string;
        fileInfoId: number;
        segmentNo: number;
      }
    >,
    user: User,
  ) {
    try {
      const savingRes = [];
      for (const file of files) {
        const fileInfo = await this.findOneFileInfoById(file.fileInfoId);

        // Create the uploads directory if it doesn't exist
        if (!fs.existsSync(this.uploadPath)) {
          fs.mkdirSync(this.uploadPath);
        }

        const fileName = `${file.fileInfoId}`; // Define a unique file name

        const filePath = path.join(
          this.uploadPath,
          `${fileName}.part${file.segmentNo}`,
        );

        // Write the chunk to the file system
        fs.writeFileSync(filePath, Buffer.from(file.buffer));

        if (file.segmentNo === fileInfo.totalSegments - 1) {
          // If this is the last chunk, all chunks have been uploaded
          // Reassemble the chunks and perform any necessary operations on the complete file
          const completeFilePath = path.join(this.uploadPath, fileName);

          const writeStream = fs.createWriteStream(completeFilePath, {
            flags: 'a',
          });

          for (let i = 0; i < fileInfo.totalSegments; i++) {
            const partFilePath = path.join(
              this.uploadPath,
              `${fileName}.part${i}`,
            );
            const chunkBuffer = fs.readFileSync(partFilePath);
            writeStream.write(chunkBuffer);
            fs.unlinkSync(partFilePath); // Remove the individual chunk file
          }

          writeStream.end();

          ///////////////////////////////////////////////////////////////
          await sleep(2000);

          this.dicomService.storeImage(completeFilePath)
          const command = `sleep 10`;

          const childProcess = spawn(command, { shell: true });

          childProcess.stdout.on('data', (data) => {
            // Process the output or extract progress information
            console.log('Output:', data.toString());

            // Extract progress information and send it to the client if desired
            const progressRegex = /Progress: (\d+)%/;
            const progressMatch = data.toString().match(progressRegex);
            if (progressMatch) {
              const progress = parseInt(progressMatch[1], 10);
              console.log(`Progress: ${progress}%`);
              // You can emit progress updates to the client using sockets or send them in the response
              // res.write(`Progress: ${progress}%\n`);

              this.fileSocketGateway.emitStreamablizationingProgress(
                user.email,
                fileInfo.name,
                Math.round(progress),
              );
            }
          });

          childProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data.toString()}`);
            // Extract progress information and send it to the client if desired
            const progressRegex = /Done: (\d+)%/;
            const progressMatch = data.toString().match(progressRegex);
            if (progressMatch) {
              const progress = parseInt(progressMatch[1], 10);
              console.log(`Progress: ${progress}%`);
              // You can emit progress updates to the client using sockets or send them in the response
              // res.write(`Progress: ${progress}%\n`);

              this.fileSocketGateway.emitStreamablizationingProgress(
                user.email,
                fileInfo.name,
                Math.round(progress),
              );
            }
            // Send an error response to the client if desired
            // res.status(500).send('An error occurred during waveform generation.');
          });

          childProcess.on('close', async (code) => {
            console.log(`Command exited with code ${code}`);
            // Read the generated waveform JSON file and extract the peaks data

            await this.filesInfoRepo.save({
              ...fileInfo,
              uploadedComplete: true,
              streamable: true,
            });
            this.fileSocketGateway.emitStreamablizationingProgress(
              user.email,
              fileInfo.name,
              Math.round(100),
            );
            const file = await this.findOneFileInfoById(fileInfo.id);
            this.fileSocketGateway.emitStreamablizationingComplete(file);
          });
        }

        savingRes.push({ segmentNo: file.segmentNo });
      }

      return savingRes.map((item, index) => ({
        segmentNo: item.segmentNo,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    skip: number = 0,
    limit: number = 3,
    isPrivate: boolean,
    tagsFilter: number[] | undefined,
    user: User,
  ): Promise<{
    data: (FileInfo & { peaks?: number[] })[];
    count: number;
  }> {
    // Create new File
    const [result, total] = await this.filesInfoRepo.findAndCount({
      relations: {
        owner: true,
      },
      where:
        isPrivate === true
          ? {
            owner: { id: user.id },
            private: true,
          }
          : {
            private: false,
          },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    return {
      data: result,
      count: total,
    };
  }

  async findOneFileInfoById(id: number): Promise<FileInfo> {
    if (!id) {
      throw new NotFoundException('file not found');
    }
    const find = await this.filesInfoRepo.findOne({
      where: { id },
      relations: { owner: true }, //['author'],
    });
    if (!find) {
      throw new NotFoundException('file not found');
    }

    return find;

  }

  async removeFile(user: User, id: number): Promise<FileInfo> {
    const fileInfo = await this.findOneFileInfoById(id);
    if (!fileInfo) {
      throw new NotFoundException('file not found');
    }
    if (fileInfo.owner.id !== user.id) {
      throw new NotAcceptableException(
        'You only could remove files that are your own!',
      );
    }
    const removeFileInfo = await this.filesInfoRepo.remove(fileInfo);

    const filesCount = await this.filesInfoRepo.count({
      where: { fileHash: fileInfo.fileHash },
    });
    if (filesCount === 0) {
      fs.unlinkSync(path.join(this.uploadPath, `${id}`)); // Remove the file
    }
    return removeFileInfo;
  }

  async createFilesInfo(user: User, infos: Partial<FileInfo>[]) {
    const newRecords = infos.map((info) =>
      this.filesInfoRepo.create({ ...info, owner: user }),
    );
    const save = await this.filesInfoRepo.save(newRecords);
    return save;
  }

  async setUploadingFileAsCompleted(user: User, id: number) {
    const find = await this.filesInfoRepo.findOne({ where: { id: id } });
    find.uploadedComplete = true;
    const save = await this.filesInfoRepo.save(find);
    return save;
  }

  whereRU(): string {
    return 'hello, you are in files app.';
  }
}
