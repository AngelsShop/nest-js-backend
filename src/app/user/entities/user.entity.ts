import { object, ObjectSchema, string } from 'yup';

export class UserEntity {
  id: string;

  phone: string;

  passwordHash: string;

  email?: string;

  firstName?: string;

  lastName?: string;
}

export const UserEntitySchema: ObjectSchema<UserEntity> = object({
  id: string().required(),
  phone: string().required(),
  passwordHash: string().required(),
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
