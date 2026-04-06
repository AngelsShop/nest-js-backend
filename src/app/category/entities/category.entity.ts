import { ApiProperty } from '@nestjs/swagger';
import { object, ObjectSchema, string } from 'yup';

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

export const schema: ObjectSchema<CategoryRaw> = object({
  id: string().uuid().required(),
  name: string().required(),
  parent_category_id: string().uuid().optional().nullable(),
});
