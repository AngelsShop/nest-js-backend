import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { Expose } from 'class-transformer';

export class ProductListItemDto {
  @Expose()
  @ApiProperty()
  productId: string;

  @Expose()
  @ApiProperty()
  variantId: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  previewImage: string;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  categoryId?: string;

  @Expose()
  @ApiProperty()
  sizes: Size[];

  @Expose()
  @ApiProperty()
  colors: string[];

  @Expose()
  @ApiProperty()
  isFavorite: boolean;

  @Expose()
  @ApiProperty()
  price: number;
}
