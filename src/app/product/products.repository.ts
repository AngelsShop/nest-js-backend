import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { ListProductsFilter, ListProductsRequest } from './types';
import { ColumnsMap } from './constants/columns';
import { PageDataRequest } from 'src/types/PageData';
import { schema } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { object, string } from 'yup';

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

    const result = await this.dbService.query<{ id: string }>(
      `SELECT * FROM products ${filters} ORDER BY created_at DESC ${this.getPagination(pageData)}`,
      params,
    );

    return (result?.rows ?? []).map((p) => schema.validateSync(p));
  }

  async countPages({ filter, pageData }: ListProductsRequest) {
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

    const item = result?.rows?.[0];

    if (!item) {
      return undefined;
    }

    return schema.validateSync(item);
  }

  async createProduct(product: CreateProductDto) {
    const insertColumns = Object.keys(product).map(
      (column) => ColumnsMap[column as keyof typeof ColumnsMap],
    );

    const valuesToInsert = Object.keys(product).reduce<unknown[]>(
      (acc, column) => {
        acc.push(product[column]);

        return acc;
      },
      [],
    );

    const result = await this.dbService.query(
      `INSERT INTO products (${insertColumns.join(',')}) VALUES (${insertColumns.map((__dirname, index) => `$${index + 1}`).join(',')}) RETURNING id`,
      valuesToInsert,
    );

    return object({
      id: string().required(),
    }).validateSync(result?.rows[0]);
  }
}
