import { ApiProperty } from '@nestjs/swagger';

export class FilesUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}

export class FilesUploadResultDto {
  @ApiProperty()
  uploadedFiles: string[];
}
