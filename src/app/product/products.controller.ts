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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Size } from 'src/constants/size';
import { OperationStatusDto } from 'src/common/dto/status.dto';
import { JwtAuthGuard } from '$app/auth/passport/jwt-auth.guard';
import { CurrentUserId } from 'src/decorators/current-user-id.decorator';
import { ProductListItemDto } from './dto/product-list-item.dto';
import { ProductVariantDto } from './dto/product-variant.dto';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('/list')
  @ApiResponse({ type: [ProductListItemDto] })
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
    @CurrentUserId() userId: string | undefined,
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
      userId,
    });
  }

  @Get(':uuid')
  @ApiResponse({ type: ProductDto })
  async getByID(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: string | undefined,
  ) {
    const product = await this.productsService.getById(uuid, userId);

    if (!product) {
      throw new HttpException(
        `Продукт с id - ${uuid} не найден`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  @Get(':uuid/variants')
  @ApiResponse({ type: ProductVariantDto })
  async getProductVariants(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @CurrentUserId() userId: string | undefined,
  ) {
    const variants = await this.productsService.getProductVariants(
      uuid,
      userId,
    );

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
    @CurrentUserId() userId: string,
  ) {
    return await this.productsService.addProductVariantToFavorites(
      variantId,
      userId,
    );
  }

  @Delete('/variant/:uuid/favorites/remove')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: OperationStatusDto })
  async removeItemFromFavorites(
    @Param('uuid', new ParseUUIDPipe()) variantId: string,
    @CurrentUserId() userId: string,
  ) {
    return await this.productsService.removeProductVariantFromFavorites(
      variantId,
      userId,
    );
  }

  @Get('/favorites/list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: [ProductListItemDto] })
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
  favoritesList(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
    @Query('categoryId', new ParseUUIDPipe({ optional: true }))
    categoryId: string,
    @Query('size', new ParseEnumPipe(Size, { optional: true })) size: Size,
    @CurrentUserId() userId: string | undefined,
  ) {
    return this.productsService.list({
      filter: {
        size,
        categoryId,
        isFavorite: true,
      },
      pageData: {
        page,
        limit,
      },
      userId,
    });
  }
}
