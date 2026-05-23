import {
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FilesUploadDto, FilesUploadResultDto } from './dto/files-upload.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBody({ type: FilesUploadDto })
  @ApiResponse({ type: FilesUploadResultDto })
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp|gif)$' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.filesService.uploadFiles(files);
  }
}
