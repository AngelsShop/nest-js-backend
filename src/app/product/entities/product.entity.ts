import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { number, object, string } from 'yup';

export class Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  size: Size;
}

export const schema = object({
  id: string().uuid().required(),
  name: string().required(),
  description: string().defined(),
  price: number().required(),
  image: string().url().required(),
  size: string().oneOf(Object.values(Size)).required(),
});
