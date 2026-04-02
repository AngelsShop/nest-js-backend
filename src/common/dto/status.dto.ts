import { ApiProperty } from '@nestjs/swagger';

export class OperationStatusDto {
  @ApiProperty()
  ok: boolean;
}

export class ItemIdDto {
  @ApiProperty()
  id: string;
}
