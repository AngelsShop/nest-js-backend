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
import { ProductCard } from './entities/product-card.entity';
import { ProductListItem } from './entities/product-list-item.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('/list')
  @ApiResponse({ type: [ProductListItem] })
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
  @ApiQuery({
    name: 'variant_id',
    type: String,
    required: false,
  })
  @ApiResponse({ type: ProductCard })
  async getByID(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Query('variant_id', new ParseUUIDPipe({ optional: true }))
    variantId: string,
  ) {
    const product = await this.productsService.getById(uuid, variantId);

    if (!product) {
      throw new HttpException(
        `Продукт с id - ${uuid} не найден`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }
}
