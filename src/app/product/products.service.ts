import { Injectable, NotFoundException } from '@nestjs/common';
import { ListProductsRequest } from './types';
import { ProductsRepository } from './products.repository';
import { PaginatedResponse } from 'src/types/PageData';
import { OperationStatusDto } from 'src/common/dto/status.dto';
import { ProductListItemDto } from './dto/product-list-item.dto';
import { ProductDto } from './dto/product.dto';
import { ProductVariantDto } from './dto/product-variant.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async list(
    data: ListProductsRequest,
  ): Promise<PaginatedResponse<ProductListItemDto>> {
    const [items, totalPages] = await Promise.all([
      this.productsRepository.list(data),
      this.productsRepository.countPages(data),
    ]);

    return {
      items: items.map((item) =>
        plainToInstance(ProductListItemDto, item, {
          excludeExtraneousValues: true,
        }),
      ),
      pageData: {
        ...data.pageData,
        totalPages,
      },
    };
  }

  async getById(id: string, userId?: string): Promise<ProductDto | undefined> {
    const product = await this.productsRepository.getById(id, userId);

    if (!product) {
      throw new NotFoundException(`Продукт ${id} не найден!`);
    }

    const variant = await this.productsRepository.getProductVariantById(
      product.variantId,
    );

    if (!variant) {
      throw new NotFoundException(
        `Дефолтный вариант ${product.variantId} у продукта ${id} не найден!`,
      );
    }

    const variants = await this.productsRepository.getProductVariants(
      id,
      userId,
    );

    return {
      ...product,
      variant,
      variants,
    };
  }

  async getProductVariants(
    uuid: string,
    userId?: string,
  ): Promise<ProductVariantDto[] | undefined> {
    return await this.productsRepository.getProductVariants(uuid, userId);
  }

  async addProductVariantToFavorites(
    variantId: string,
    userId: string,
  ): Promise<OperationStatusDto> {
    const variant =
      await this.productsRepository.getProductVariantById(variantId);

    if (!variant) {
      throw new NotFoundException('Вариант продукта не найден');
    }

    await this.productsRepository.addProductVariantToFavorites(variant, userId);

    return {
      ok: true,
    };
  }

  async removeProductVariantFromFavorites(
    variantId: string,
    userId: string,
  ): Promise<OperationStatusDto> {
    await this.productsRepository.removeProductVariantFromFavorites(
      variantId,
      userId,
    );

    return {
      ok: true,
    };
  }
}
