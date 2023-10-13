import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import { createReadStream, existsSync } from 'fs';
import * as path from 'path';
import { AccessTokenGuard } from 'src/authentication/guards/accessToken.guard';
import { Roles } from 'src/authorization/roles.decorator';
import { RolesGuard } from 'src/authorization/roles.guard';
import { UserRoles } from 'src/enum/userRoles.enum';
import { strToBool } from 'src/helperFunctions/strToBool';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.middleware';
import { User } from 'src/users/entities/user.entity';
import { FileDto } from './dto/files/file.dto';
import { PaginationFilesDto } from './dto/files/pagination-files.dto';
import { FileInfo } from './entities/fileInfo.entity';
import { FilesService } from './files.service';
import { FileValidationPipe } from './validation.pipe';
import { AddFileInfoDto } from './dto/files/addFileInfo.dto';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files_app')
export class FilesController {
  private uploadPath: string;

  constructor(private readonly filesService: FilesService) {
    this.uploadPath = path.join(process.cwd(), '..', 'uploads', 'files'); // Define your upload directory
    !existsSync(path.join(process.cwd(), '..', 'uploads')) ? fs.mkdirSync(path.join(process.cwd(), '..', 'uploads')) : undefined;
    !existsSync(this.uploadPath) ? fs.mkdirSync(this.uploadPath) : undefined;
  }

  @Get('socket_initializing')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.doctorsAdmin)
  async socketInitilizing() {
    return {};
  }

  @Get('file_conversion/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.doctorsAdmin)
  async fileConversionCompleteStatus(@Param('id') id: string) {
    const fileInfo = await this.filesService.findOneFileInfoById(
      parseInt(id),
    );
    return { [id]: fileInfo.streamable };
  }

  @Post('uploads')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.doctorsAdmin)
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: { fileSize: 1024 * 1024 * 1024 * 10 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          }
        },
        fileHash: { type: 'string' },
        fileInfoId: { type: 'number' },
        segmentNo: { type: 'number' }
      },
    },
  })
  async uploadFiles(
    @CurrentUser() user: User,
    @Body('fileHash') fileHash: string,
    @Body('fileInfoId') fileInfoId: string,
    @Body('segmentNo') segmentNo: string,
    @UploadedFiles(FileValidationPipe) files: Array<Express.Multer.File>,
  ) {
    const res = await this.filesService.uploads(
      files.map((file, index) => {
        return {
          ...file,
          fileHash: fileHash,
          owner: user,
          fileInfoId: parseInt(fileInfoId),
          segmentNo: parseInt(segmentNo),
        };
      }),
      user,
    );
    return res;
  }

  @Get('all-files')
  @UseGuards(AccessTokenGuard)
  @Serialize(PaginationFilesDto)
  async getAllFiles(
    @CurrentUser() user: User,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('isPrivate') isPrivate: string,
    @Query('tagsFilter') tagsFilter: string | undefined,
  ) {

    return await this.filesService.findAll(
      parseInt(skip),
      parseInt(limit),
      strToBool(isPrivate),
      tagsFilter
        ? tagsFilter.split(',').map((item) => parseInt(item))
        : undefined,
      user,
    );
  }

  @Get('get-file/:id')
  @UseGuards(AccessTokenGuard)
  async getFile(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const fileInfo = await this.filesService.findOneFileInfoById(
        parseInt(id),
      );

      if (
        (fileInfo.private && user.id === fileInfo.owner.id) ||
        fileInfo.private === false
      ) {
        const filePath = path.join(this.uploadPath, `${fileInfo.id}`);

        if (!existsSync(filePath)) {
          throw new NotFoundException('File not found');
        }
        const stream = createReadStream(filePath);
        const fileSize = fs.statSync(filePath).size;

        res.set({
          // 'Content-Type': fileInfo.type,
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileSize,
          // 'Content-Disposition': `attachment; filename=${fileInfo.name}`,
        });

        stream.pipe(res);

        // return new StreamableFile(stream); //if you want to use this, you should replace `@Res({ passthrough: true }) res: Response` instead of `@Res() res: Response`
      } else {
        throw new UnauthorizedException();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  @Get('get-file-chunk/:id/:chunkSize/:chunkNumber')
  @UseGuards(AccessTokenGuard)
  async getFileChunk(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('chunkSize') chunkSize: string,
    @Param('chunkNumber') chunkNumber: string,
    @Res() res: Response,
  ) {
    try {
      const fileInfo = await this.filesService.findOneFileInfoById(
        parseInt(id),
      );

      if (
        (fileInfo.private && user.id === fileInfo.owner.id) ||
        fileInfo.private === false
      ) {
        const filePath = path.join(this.uploadPath, `${fileInfo.id}`);

        if (!existsSync(filePath)) {
          throw new NotFoundException('File not found');
        }

        const fileSize = fs.statSync(filePath).size;

        const start = Number(chunkNumber) * Number(chunkSize);
        const end = Math.min(start + Number(chunkSize) - 1, fileSize - 1);

        res.setHeader('Content-Length', end - start + 1);

        const fileStream = createReadStream(filePath, { start, end });
        fileStream.pipe(res);
      } else {
        throw new UnauthorizedException();
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  @Delete('delete-file/:id')
  @UseGuards(AccessTokenGuard)
  @Serialize(FileDto)
  async removeFile(@CurrentUser() user: User, @Param('id') id: string) {
    return this.filesService.removeFile(user, parseInt(id));
  }

  @Post('create-files-info')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.doctorsAdmin)
  @ApiBody({ required: true, isArray: true, type: AddFileInfoDto })
  async createFilesInfo(
    @CurrentUser() user: User,
    @Body() body: AddFileInfoDto[],
  ) {
    return this.filesService.createFilesInfo(user, body);
  }

  @Post('set-uploading-file-as-completed')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRoles.doctorsAdmin)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileInfoId: { type: 'number' }
      }
    }
  })
  async setUploadingFileAsCompleted(
    @CurrentUser() user: User,
    @Body('fileInfoId') fileInfoId: number,
  ) {
    return this.filesService.setUploadingFileAsCompleted(user, fileInfoId);
  }

  @Get()
  // @UseGuards(AccessTokenGuard)
  whereRU(): string {
    return this.filesService.whereRU();
  }
}
