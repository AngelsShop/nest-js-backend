import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  async getUser(_id: string) {
    return;
  }

  async createUser(_user: CreateUserDto) {
    return;
  }
}
