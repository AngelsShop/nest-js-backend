import { User } from '$app/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class SignUpResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}
