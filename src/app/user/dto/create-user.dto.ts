import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class CreateUserResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}
