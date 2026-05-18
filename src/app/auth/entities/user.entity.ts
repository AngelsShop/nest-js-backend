import { ApiProperty } from '@nestjs/swagger';
import { object, ObjectSchema, string } from 'yup';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;
}

export const schema: ObjectSchema<User> = object({
  id: string().required(),
  phone: string().required(),
  email: string()
    .transform((v: string | null) => v ?? undefined)
    .optional(),
  firstName: string()
    .transform((v: string | null) => v ?? undefined)
    .optional(),
  lastName: string()
    .transform((v: string | null) => v ?? undefined)
    .optional(),
}).stripUnknown();
