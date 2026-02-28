import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  size: Size;
}
