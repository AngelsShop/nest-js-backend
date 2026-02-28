import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { ListProductsFilter, ListProductsRequest } from './types/product';
import { ColumnsMap } from './constants/columns';
import { PageDataRequest } from 'src/types/PageData';

@Injectable()
export class ProductsRepository {
  constructor(private readonly dbService: DbService) {}

  private getProductsFilterQuery(filter: ListProductsFilter) {
    const filters = ['WHERE 1=1'];
    const params: unknown[] = [];

    for (const key in filter) {
      const dbField = ColumnsMap[key];

      if (!dbField || filter[key] === undefined) {
        continue;
      }

      params.push(filter[key]);

      filters.push(`${dbField} = $${params.length}`);
    }

    return {
      filters: filters.join(' AND '),
      params,
    };
  }

  private getPagination({ page, limit }: PageDataRequest) {
    return `LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  async list({ filter, pageData }: ListProductsRequest) {
    const { filters, params } = this.getProductsFilterQuery(filter);

    const result = await this.dbService.query(
      `SELECT * FROM products ${filters} ORDER BY created_at DESC ${this.getPagination(pageData)}`,
      params,
    );

    return result?.rows as [];
  }

  async count({ filter, pageData }: ListProductsRequest) {
    const { filters, params } = this.getProductsFilterQuery(filter);

    const result = await this.dbService.query(
      `SELECT * FROM products ${filters} ORDER BY created_at DESC`,
      params,
    );

    return Math.ceil((result?.rowCount ?? 0) / pageData.limit);
  }

  async getById(id: string) {
    const result = await this.dbService.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );

    return result?.rows?.[0] as undefined;
  }
}
