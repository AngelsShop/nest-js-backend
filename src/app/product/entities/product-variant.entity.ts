import { ApiProperty } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { array, boolean, number, object, ObjectSchema, string } from 'yup';

export class ProductVariant {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  size: Size;

  @ApiProperty()
  color: string;

  @ApiProperty()
  isDefault: boolean;
}

export const productVariantSchema: ObjectSchema<ProductVariant> = object({
  id: string().uuid().required(),
  productId: string().uuid().required(),
  name: string().required(),
  description: string().required(),
  color: string().required(),
  isDefault: boolean().required(),
  price: number().required(),
  images: array(string().required()).required(),
  size: string().oneOf(Object.values(Size)).required(),
});
