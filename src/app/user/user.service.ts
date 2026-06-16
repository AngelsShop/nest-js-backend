import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async getUser(id: string): Promise<UserDto | undefined> {
    return await this.repository.getUser(id);
  }

  async getUserPasswordHash(id: string) {
    return await this.repository.getUserPasswordHash(id);
  }

  async createUser(user: CreateUserDto) {
    const userData = await this.repository.getUser(user.login);

    if (userData) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.repository.createUser(user);
  }

  async updateUser(id: string, user: UpdateUserDto) {
    return await this.repository.updateUser(id, user);
  }
}
