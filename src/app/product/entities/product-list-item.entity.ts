import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { number, object, string } from 'yup';
import { ProductVariant } from './product-variant.entity';

export class ProductListItem {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  variantId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  previewImage: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  colors: ProductVariant['color'][];

  @ApiProperty()
  sizes: ProductVariant['size'][];

  @ApiProperty()
  categoryId?: string;
}

export const productListItemSchema = object({
  productId: string().uuid().required(),
  variantId: string().uuid().required(),
  title: string().required(),
  price: number().required(),
  color: string().required(),
  previewImage: string().url().required(),
  categoryId: string()
    .transform((value: string | null) => value ?? undefined)
    .optional(),
  size: string().oneOf(Object.values(Size)).required(),
});
