import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { Product } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('/list')
  @ApiResponse({ type: [Product] })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'categoryId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'size',
    enum: Size,
    required: false,
  })
  list(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
    @Query('categoryId', new ParseUUIDPipe({ optional: true }))
    categoryId: string,
    @Query('size', new ParseEnumPipe(Size, { optional: true })) size: Size,
  ) {
    return this.productsService.list({
      filter: {
        size,
        categoryId,
      },
      pageData: {
        page,
        limit,
      },
    });
  }

  @Get(':uuid')
  @ApiResponse({ type: Product })
  async getByID(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const product = await this.productsService.getById(uuid);

    if (!product) {
      throw new HttpException(
        `Продукт с id - ${uuid} не найден`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }
}
