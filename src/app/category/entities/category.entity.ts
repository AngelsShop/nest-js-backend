import { ApiProperty } from '@nestjs/swagger';
import { array, object, ObjectSchema, string } from 'yup';

export class Category {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  children: Category[];
}

export class CategoryRaw {
  id: string;

  name: string;

  parent_category_id?: string | null;
}

export const schema: ObjectSchema<Category> = object({
  id: string().uuid().required(),
  name: string().required(),
  children: array<Category>().required(),
});

export const dbSchema: ObjectSchema<CategoryRaw> = object({
  id: string().uuid().required(),
  name: string().required(),
  parent_category_id: string().uuid().optional().nullable(),
});
