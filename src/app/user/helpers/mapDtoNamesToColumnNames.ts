import { User } from '../entities/user.entity';

export const mapDtoNamesToColumnNames = (
  field: keyof User,
): string | undefined => {
  const map: Record<Exclude<keyof User, 'id'>, string> = {
    phone: 'phone',
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
  };

  return field in map ? map[field] : undefined;
};
