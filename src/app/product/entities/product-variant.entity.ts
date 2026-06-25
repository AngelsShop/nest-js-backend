import { Size } from 'src/constants/size';
import { array, boolean, number, object, ObjectSchema, string } from 'yup';

export class ProductVariantEntity {
  id: string;

  productId: string;

  name: string;

  description: string;

  price: number;

  images: string[];

  size: Size;

  color: string;

  isDefault: boolean;

  isFavorite?: boolean;
}

export const ProductVariantEntitySchema: ObjectSchema<ProductVariantEntity> =
  object({
    id: string().uuid().required(),
    productId: string().uuid().required(),
    name: string().required(),
    description: string().required(),
    color: string().required(),
    isDefault: boolean().required(),
    isFavorite: boolean().optional(),
    price: number().required(),
    images: array(string().required()).required(),
    size: string().oneOf(Object.values(Size)).required(),
  }).stripUnknown();
