import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { compare, hash } from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { SALT_ROUNDS } from './constants';
import { schema, User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private repository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, SALT_ROUNDS);
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await compare(password, hash);
  }

  async getUser(login: string): Promise<User> {
    const user = await this.repository.getUser(login);

    if (!user) {
      throw new NotFoundException();
    }

    return schema.validateSync(user);
  }

  signIn(user: User) {
    const payload = { username: user.phone, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(signInDto: SignInDto): Promise<User | undefined> {
    const user = await this.repository.getUser(signInDto.login);

    if (!user) {
      throw new NotFoundException();
    }

    if (!(await this.comparePassword(signInDto.password, user.passwordHash))) {
      throw new UnauthorizedException();
    }

    return schema.validateSync(user);
  }

  async signUp(dto: SignUpDto) {
    const user = await this.repository.createUser({
      login: dto.login,
      password: await this.hashPassword(dto.password),
    });

    return { ...this.signIn(user), user };
  }
}
