import { Injectable } from '@nestjs/common';
import { ListProductsRequest } from './types';
import { ProductsRepository } from './products.repository';
import { Product } from './entities/product.entity';
import { PaginatedResponse } from 'src/types/PageData';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async list(data: ListProductsRequest): Promise<PaginatedResponse<Product>> {
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

  async getById(id: string): Promise<Product | undefined> {
    return await this.productsRepository.getById(id);
  }

  async create(product: CreateProductDto) {
    return await this.productsRepository.createProduct(product);
  }
}
