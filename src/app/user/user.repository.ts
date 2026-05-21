import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TableNames } from 'src/constants/tables';
import { getInsertValuesPlaceholders } from '$lib/getInsertValuesPlaceholders';
import { User, schema } from './entities/user.entity';
import { string } from 'yup';

@Injectable()
export class AuthRepository {
  constructor(private dbService: DbService) {}

  private async getCrateUserData(data: CreateUserDto) {
    return {
      phone: data.login,
      password_hash: data.password,
    };
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

    const user = res?.rows?.[0];

    if (!user) {
      return;
    }

    return string().required().validate(user);
  }

  async getUser(login: string): Promise<User | undefined> {
    const res = await this.dbService.query(
      `
        SELECT
          id,
          phone,
          first_name as firstName,
          last_name as lastName,
          email,
        FROM ${TableNames.USERS}
        WHERE phone = $1
      `,
      [login],
    );

    const user = res?.rows?.[0];

    if (!user) {
      return;
    }

    return schema.validate(user);
  }

  async createUser(data: CreateUserDto) {
    const userData = await this.getCrateUserData(data);

    const res = await this.dbService.query(
      `
      INSERT INTO ${TableNames.USERS}
      (${Object.keys(userData).join()})
      VALUES (${getInsertValuesPlaceholders(Object.values(userData))})
      RETURNING
        id,
        phone,
        first_name as firstName,
        last_name as lastName,
        email
    `,
      Object.values(userData),
    );

    return schema.validateSync(res?.rows?.[0]);
  }
}
