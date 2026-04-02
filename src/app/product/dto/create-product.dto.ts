import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { number, object, ObjectSchema, string } from 'yup';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEnum(Size)
  size?: Size;
}

export const schema: ObjectSchema<CreateProductDto> = object({
  name: string().required(),
  description: string().defined(),
  price: number().required(),
  image: string().url().required(),
  categoryId: string().optional(),
  size: string().oneOf(Object.values(Size)).optional().default(undefined),
});
