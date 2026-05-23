import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from './constants';
import { schema, User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '$app/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  signIn(user: User) {
    const payload = { username: user.phone, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(signInDto: SignInDto): Promise<User | undefined> {
    const user = await this.userService.getUser(signInDto.login);

    if (!user) {
      throw new NotFoundException();
    }

    const passwordHash = await this.userService.getUserPasswordHash(user.phone);

    if (!passwordHash) {
      throw new InternalServerErrorException();
    }

    if (!(await compare(signInDto.password, passwordHash))) {
      throw new UnauthorizedException();
    }

    return schema.validateSync(user);
  }

  async signUp(dto: SignUpDto) {
    const user = await this.userService.createUser({
      login: dto.login,
      password: await hash(dto.password, SALT_ROUNDS),
    });

    return { ...this.signIn(user), user };
  }
}
