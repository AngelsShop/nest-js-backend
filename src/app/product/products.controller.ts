import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDto, ProductDto, UpdateProductDto } from './dto';
import { ProductService } from './products.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OperationStatusDto } from 'src/common/dto/status';
import { Size } from 'src/constants/size';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('/list')
  @ApiResponse({ type: [ProductDto] })
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
  @ApiResponse({ type: ProductDto })
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

  @Post('/create')
  @ApiResponse({ type: ProductDto })
  create(@Body() _createProduct: CreateProductDto) {
    throw new HttpException(
      'Метод еще не разработан',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @Put('/update/:uuid')
  @ApiResponse({ type: ProductDto })
  update(
    @Param('uuid', new ParseUUIDPipe()) _uuid: string,
    @Body() _updateProduct: UpdateProductDto,
  ) {
    throw new HttpException(
      'Метод еще не разработан',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @Delete(':uuid')
  @ApiResponse({
    type: OperationStatusDto,
  })
  delete(@Param('uuid', new ParseUUIDPipe()) _uuid: string) {
    throw new HttpException(
      'Метод еще не разработан',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}
