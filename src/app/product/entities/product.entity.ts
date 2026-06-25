import { boolean, object, ObjectSchema, string } from 'yup';

export class ProductEntity {
  id: string;

  title: string;

  previewImage: string;

  createdAt: string;

  variantId: string;

  categoryId?: string;

  isFavorite: boolean;
}

export const ProductEntitySchema: ObjectSchema<ProductEntity> = object({
  id: string().uuid().required(),
  title: string().required(),
  createdAt: string().required(),
  variantId: string().required(),
  isFavorite: boolean().required(),
  previewImage: string().url().required(),
  categoryId: string()
    .transform((value: string | null) => value ?? undefined)
    .optional(),
}).stripUnknown();
