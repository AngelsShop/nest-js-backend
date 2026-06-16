import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { array, boolean, number, object, ObjectSchema, string } from 'yup';
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
  isFavorite: boolean;

  @ApiProperty()
  colors: ProductVariant['color'][];

  @ApiProperty()
  sizes: ProductVariant['size'][];

  @ApiProperty()
  categoryId?: string;
}

export const productListItemSchema: ObjectSchema<ProductListItem> = object({
  productId: string().uuid().required(),
  variantId: string().uuid().required(),
  title: string().required(),
  price: number().required(),
  isFavorite: boolean().required(),
  previewImage: string().required(),
  categoryId: string()
    .transform((value: string | null) => value ?? undefined)
    .optional(),
  colors: array(string().required()).required(),
  sizes: array(string().oneOf(Object.values(Size)).required()).required(),
}).stripUnknown();
