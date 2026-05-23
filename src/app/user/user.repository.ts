import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TableNames } from 'src/constants/tables';
import { getInsertValuesPlaceholders } from '$lib/getInsertValuesPlaceholders';
import { User, schema } from './entities/user.entity';
import { object, string } from 'yup';

@Injectable()
export class UserRepository {
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
          first_name as firstName,
          last_name as lastName,
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
