import { Injectable } from '@nestjs/common';
import { ListProductsRequest } from './types/product';
import { ProductDto } from './dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async list(data: ListProductsRequest): Promise<ProductDto[]> {
    return await this.productsRepository.list(data);
  }

  async getById(id: string): Promise<ProductDto | undefined> {
    return await this.productsRepository.getById(id);
  }
}
