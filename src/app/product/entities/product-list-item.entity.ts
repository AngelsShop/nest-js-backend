import { Size } from 'src/constants/size';
import { array, boolean, number, object, ObjectSchema, string } from 'yup';
import { ProductVariantEntity } from './product-variant.entity';

export class ProductListItemEntityShort {
  productId: string;
  variantId: string;
  title: string;
  previewImage: string;
  createdAt: string;
  price: number;
  isFavorite: boolean;
  isDefault: boolean;
  color: ProductVariantEntity['color'];
  size: ProductVariantEntity['size'];
  categoryId?: string;
}
export class ProductListItemEntity extends ProductListItemEntityShort {
  colors: ProductVariantEntity['color'][];
  sizes: ProductVariantEntity['size'][];
}

export const ProductListItemShortSchema: ObjectSchema<ProductListItemEntityShort> =
  object({
    productId: string().uuid().required(),
    variantId: string().uuid().required(),
    title: string().required(),
    createdAt: string().required(),
    price: number().required(),
    isFavorite: boolean().required(),
    isDefault: boolean().required(),
    previewImage: string().required(),
    categoryId: string()
      .transform((value: string | null) => value ?? undefined)
      .optional(),
    color: string().required(),
    size: string().oneOf(Object.values(Size)).required(),
  }).stripUnknown();

export const ProductListItemEntitySchema: ObjectSchema<ProductListItemEntity> =
  ProductListItemShortSchema.concat(
    object({
      colors: array(string().required()).required(),
      sizes: array(string().oneOf(Object.values(Size)).required()).required(),
    }).stripUnknown(),
  );
