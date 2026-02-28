import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { ListProductsFilter } from './types/product';

@Injectable()
export class ProductsRepository {
  constructor(private readonly dbService: DbService) {}

  async list(_filter: ListProductsFilter) {
    const result = await this.dbService.query('SELECT * FROM products');

    return result?.rows as [];
  }

  count() {
    return 0;
  }

  async getById(id: string) {
    const result = await this.dbService.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );

    return result?.rows?.[0] as undefined;
  }
}
