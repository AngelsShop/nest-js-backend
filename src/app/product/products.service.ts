import { Injectable } from '@nestjs/common';
import { ListProductsRequest } from './types';
import { ProductsRepository } from './products.repository';
import { ProductCard } from './entities/product-card.entity';
import { PaginatedResponse } from 'src/types/PageData';
import { ProductListItem } from './entities/product-list-item.entity';

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

  async getById(
    id: string,
    variantId?: string,
  ): Promise<ProductCard | undefined> {
    return await this.productsRepository.getById(id, variantId);
  }
}
