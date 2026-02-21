import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto, ProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';
import { ApiResponse } from '@nestjs/swagger';
import { OperationStatusDto } from 'src/common/dto/status';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({ type: [ProductDto] })
  list() {
    return this.productsService.list();
  }

  @Get(':uuid')
  @ApiResponse({ type: ProductDto })
  getByID(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.productsService.getById(uuid);
  }

  @Post('/create')
  @ApiResponse({ type: ProductDto })
  create(@Body() createProduct: CreateProductDto) {
    return this.productsService.create(createProduct);
  }

  @Put('/update/:uuid')
  @ApiResponse({ type: ProductDto })
  update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() updateProduct: UpdateProductDto,
  ) {
    const product = this.productsService.update(uuid, updateProduct);

    if (!product) {
      throw new HttpException(
        `Продукт с id - ${uuid} не найден`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  @Delete(':uuid')
  @ApiResponse({
    type: OperationStatusDto,
  })
  delete(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.productsService.delete(uuid);
  }
}
