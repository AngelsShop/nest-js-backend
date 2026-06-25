import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';

export class ProductVariantDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  size: Size;

  @ApiProperty()
  color: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isFavorite?: boolean;
}
