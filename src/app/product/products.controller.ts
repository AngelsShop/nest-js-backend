import {
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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { ProductCard } from './entities/product-card.entity';
import { ProductListItem } from './entities/product-list-item.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { OperationStatusDto } from 'src/common/dto/status.dto';
import { JwtAuthGuard } from '$app/auth/passport/jwt-auth.guard';
import { type RequestWithUser } from '$app/auth/types/requestWithUser';

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
  @ApiResponse({ type: ProductCard })
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

  @Get(':uuid/variants')
  @ApiResponse({ type: ProductVariant })
  async getProductVariants(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const variants = await this.productsService.getProductVariants(uuid);

    if (!variants) {
      throw new HttpException(
        `Продукт с id - ${uuid} не найден`,
        HttpStatus.NOT_FOUND,
      );
    }

    return variants;
  }

  @Post('/variant/:uuid/favorites/add')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: OperationStatusDto })
  async addItemToFavorites(
    @Param('uuid', new ParseUUIDPipe()) variantId: string,
    @Req() request: RequestWithUser,
  ) {
    return await this.productsService.addProductVariantToFavorites(
      variantId,
      request.user.id,
    );
  }

  @Delete('/variant/:uuid/favorites/remove')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: OperationStatusDto })
  async removeItemFromFavorites(
    @Param('uuid', new ParseUUIDPipe()) variantId: string,
    @Req() request: RequestWithUser,
  ) {
    return await this.productsService.removeProductVariantFromFavorites(
      variantId,
      request.user.id,
    );
  }
}
