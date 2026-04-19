import { Size } from 'src/constants/size';
import { boolean, number, object, ObjectSchema, date, string } from 'yup';

export class ProductListItemDto {
  productId: string;
  variantId: string;
  title: string;
  previewImage: string;
  createdAt: Date;
  categoryId?: string;
  size: Size;
  color: string;
  isDefault: boolean;
  price: number;
}

export const productListItemDtoSchema: ObjectSchema<ProductListItemDto> =
  object({
    productId: string().uuid().required(),
    variantId: string().uuid().required(),
    title: string().required(),
    price: number().required(),
    color: string().required(),
    isDefault: boolean().required(),
    createdAt: date()
      .transform((v) => new Date(String(v)))
      .required(),
    previewImage: string().required(),
    categoryId: string()
      .transform((v: string | null) => v ?? undefined)
      .optional(),
    size: string().oneOf(Object.values(Size)).required(),
  });
