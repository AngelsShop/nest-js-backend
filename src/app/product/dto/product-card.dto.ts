import { object, ObjectSchema, string } from 'yup';

export class ProductCardDto {
  id: string;
  title: string;
  previewImage: string;
  createdAt: string;
  categoryId?: string;
  variantId: string;
}

export const productCardDtoSchema: ObjectSchema<ProductCardDto> = object({
  id: string().uuid().required(),
  title: string().required(),
  previewImage: string().required(),
  createdAt: string().required(),
  categoryId: string()
    .uuid()
    .transform((value: string | null) => value ?? undefined)
    .optional(),
  variantId: string().uuid().required(),
});
