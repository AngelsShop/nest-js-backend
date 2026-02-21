import { ApiProperty } from '@nestjs/swagger';

export class OperationStatusDto {
  @ApiProperty()
  ok: boolean;
}
