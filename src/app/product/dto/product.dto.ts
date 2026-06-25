import { ApiProperty } from '@nestjs/swagger';
import { ProductVariantDto } from './product-variant.dto';

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  previewImage: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  isFavorite: boolean;

  @ApiProperty({ type: ProductVariantDto })
  variant: ProductVariantDto;

  @ApiProperty({ type: [ProductVariantDto] })
  variants: ProductVariantDto[];
}
