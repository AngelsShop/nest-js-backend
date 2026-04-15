import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { array, number, object, ObjectSchema, string } from 'yup';
import { ProductVariant, schema } from './product-variant.entity';

export class ProductCard {
  @ApiProperty()
  id: string;

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

  @ApiProperty()
  variant: ProductVariant;
  variants: ProductVariant[];
}

export const productCardSchema: ObjectSchema<ProductCard> = object({
  id: string().uuid().required(),
  defaultVariantId: string().uuid().required(),
  title: string().required(),
  price: number().required(),
  colors: array(string().required()).required(),
  previewImage: string().url().required(),
  categoryId: string()
    .transform((value: string | null) => value ?? undefined)
    .optional(),
  sizes: array(string().oneOf(Object.values(Size)).required()).required(),
  variant: schema,
  variants: array(schema).required(),
});
