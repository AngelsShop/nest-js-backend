import { Injectable, NotFoundException } from '@nestjs/common';
import { ListProductsRequest } from './types';
import { ProductsRepository } from './products.repository';
import { ProductCard } from './entities/product-card.entity';
import { PaginatedResponse } from 'src/types/PageData';
import { ProductListItem } from './entities/product-list-item.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { OperationStatusDto } from 'src/common/dto/status.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async list(
    data: ListProductsRequest,
  ): Promise<PaginatedResponse<ProductListItem>> {
    const [items, totalPages] = await Promise.all([
      this.productsRepository.list(data),
      this.productsRepository.countPages(data),
    ]);

    return {
      items,
      pageData: {
        ...data.pageData,
        totalPages,
      },
    };
  }

  async getById(id: string): Promise<ProductCard | undefined> {
    return await this.productsRepository.getById(id);
  }

  async getProductVariants(
    uuid: string,
  ): Promise<ProductVariant[] | undefined> {
    return await this.productsRepository.getProductVariants(uuid);
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
