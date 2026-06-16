import { UserDto } from '../dto/user.dto';

export const mapDtoNamesToColumnNames = (
  field: keyof UserDto,
): string | undefined => {
  const map: Record<Exclude<keyof UserDto, 'id'>, string> = {
    phone: 'phone',
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
  };

  return field in map ? map[field] : undefined;
};
