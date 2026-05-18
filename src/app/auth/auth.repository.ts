import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { SignUpDto } from './dto/sign-up.dto';
import { TableNames } from 'src/constants/tables';
import { getInsertValuesPlaceholders } from '$lib/getInsertValuesPlaceholders';
import { schema, UserDto } from './dto/user.dto';
import { schema as userSchema } from './entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(private dbService: DbService) {}

  private async getCrateUserData(data: SignUpDto) {
    return {
      phone: data.login,
      password_hash: data.password,
    };
  }

  async getUser(login: string): Promise<UserDto | undefined> {
    const res = await this.dbService.query(
      `
        SELECT
          id,
          phone,
          first_name as firstName,
          last_name as lastName,
          email,
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

    const validatedUser = schema.validateSync(user);

    return validatedUser;
  }

  async createUser(data: SignUpDto) {
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
        email,
        password_hash as "passwordHash"
    `,
      Object.values(userData),
    );

    return userSchema.validateSync(res?.rows?.[0]);
  }
}
