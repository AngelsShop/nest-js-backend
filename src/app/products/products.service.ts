import { Injectable } from '@nestjs/common';
import { CreateProduct, Product } from './interfaces/product';
import { uuid } from '$lib/uuid';
import { OperationStatusDto } from 'src/common/dto/status';
import { CreateProductDto, ProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [];

  list(): ProductDto[] {
    return this.products;
  }

  getById(id: string): ProductDto | undefined {
    return this.products.find((product) => product.id === id);
  }

  create(product: CreateProduct): CreateProductDto {
    const createdProduct = {
      id: uuid(),
      ...product,
    };

    this.products.push(createdProduct);

    return createdProduct;
  }

  update(id: string, product: CreateProduct): UpdateProductDto | undefined {
    const index = this.products.findIndex((product) => product.id === id);

    if (index < 0) {
      return;
    }

    this.products.splice(index, 1, { ...this.products[index], ...product });

    return this.products[index];
  }

  delete(id: string): OperationStatusDto {
    const index = this.products.findIndex((product) => product.id === id);

    if (index < 0) {
      return {
        ok: false,
      };
    }

    this.products.splice(index, 1);

    return {
      ok: true,
    };
  }
}
