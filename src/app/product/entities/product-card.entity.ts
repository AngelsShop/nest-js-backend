import { ApiProperty } from '@nestjs/swagger';
import { array, object, ObjectSchema, string } from 'yup';
import { ProductVariant, productVariantSchema } from './product-variant.entity';

export class ProductCard {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  previewImage: string;

  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  variant: ProductVariant;

  @ApiProperty()
  variants: ProductVariant[];
}

export const productCardSchema: ObjectSchema<ProductCard> = object({
  id: string().uuid().required(),
  title: string().required(),
  previewImage: string().url().required(),
  categoryId: string()
    .transform((value: string | null) => value ?? undefined)
    .optional(),
  variant: productVariantSchema.required(),
  variants: array(productVariantSchema).required(),
}).stripUnknown();
