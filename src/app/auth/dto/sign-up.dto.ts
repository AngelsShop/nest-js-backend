import { UserDto } from '$app/user/dto/user.dto';
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
  user: UserDto;
}
