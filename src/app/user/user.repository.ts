import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TableNames } from 'src/constants/tables';
import { getInsertValuesPlaceholders } from '$lib/getInsertValuesPlaceholders';
import { User, schema } from './entities/user.entity';
import { object, string } from 'yup';
import { mapDtoNamesToColumnNames } from './helpers/mapDtoNamesToColumnNames';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private dbService: DbService) {}

  private prepareUpdateUserData(data: UpdateUserDto) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const mapedKey = mapDtoNamesToColumnNames(key as keyof UpdateUserDto);
      if (!value || !mapedKey) {
        return acc;
      }

      acc[mapedKey] = value;

      return acc;
    }, {});
  }

  async getUserPasswordHash(login: string): Promise<string | undefined> {
    const res = await this.dbService.query(
      `
        SELECT
          password_hash as "passwordHash"
        FROM ${TableNames.USERS}
        WHERE phone = $1
      `,
      [login],
    );

    const hashData = res?.rows?.[0];

    if (!hashData) {
      return;
    }

    const { passwordHash } = await object({
      passwordHash: string().required(),
    }).validate(hashData);

    return passwordHash;
  }

  async getUser(loginOrId: string): Promise<User | undefined> {
    const res = await this.dbService.query(
      `
        SELECT
          id,
          phone,
          first_name as "firstName",
          last_name as "lastName",
          email
        FROM ${TableNames.USERS}
        WHERE 
          phone = $1
          OR id::text = $1
      `,
      [loginOrId],
    );

    const user = res?.rows?.[0];

    if (!user) {
      return;
    }

    return schema.validate(user);
  }

  async createUser(data: CreateUserDto) {
    const res = await this.dbService.query(
      `
      INSERT INTO ${TableNames.USERS}
      (phone, password_hash)
      VALUES ($1, $2)
      RETURNING
        id,
        phone,
        first_name as "firstName",
        last_name as "lastName",
        email
    `,
      [data.login, data.password],
    );

    return schema.validateSync(res?.rows?.[0]);
  }

  async updateUser(id: string, user: UpdateUserDto) {
    const preparedData = this.prepareUpdateUserData(user);

    const res = await this.dbService.query(
      `
        UPDATE ${TableNames.USERS}
        SET
          ${getInsertValuesPlaceholders(Object.keys(preparedData), 2)}
        WHERE
          id = $1
        RETURNING
          id,
          phone,
          first_name as "firstName",
          last_name as "lastName",
          email
      `,
      [id, ...Object.values(preparedData)],
    );

    const updateUser = res?.rows?.[0];

    if (!updateUser) {
      return;
    }

    return schema.validate(updateUser);
  }
}
