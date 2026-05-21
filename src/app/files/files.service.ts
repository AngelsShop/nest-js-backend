import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly config: ConfigService) {}

  async uploadFiles(files: Express.Multer.File[]) {
    const filePaths = files.map((file) => {
      return path.join(
        this.config.getOrThrow<string>('UPLOADS_DIR'),
        file.originalname,
      );
    });

    await Promise.all(
      files.map((file, index) => fs.writeFile(filePaths[index], file.buffer)),
    );

    return {
      uploadedFiles: filePaths,
    };
  }
}
