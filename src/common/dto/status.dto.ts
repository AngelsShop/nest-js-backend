import { ApiProperty } from '@nestjs/swagger';

export class OperationStatusDto {
  @ApiProperty()
  ok: boolean;

  @ApiProperty({ required: false })
  message?: string;
}

export class ItemIdDto {
  @ApiProperty()
  id: string;
}
