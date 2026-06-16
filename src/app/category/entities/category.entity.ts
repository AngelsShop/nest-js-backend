import { object, ObjectSchema, string } from 'yup';

export class Category {
  id: string;

  name: string;

  parentCategoryId?: string | null;
}

export const CategorySchema: ObjectSchema<Category> = object({
  id: string().uuid().required(),
  name: string().required(),
  parentCategoryId: string().uuid().optional().nullable(),
});
