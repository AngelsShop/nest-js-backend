import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsEmail()
  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;

  @ApiProperty()
  @ApiProperty({ required: false })
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @ApiProperty({ required: false })
  @IsOptional()
  lastName?: string;
}
