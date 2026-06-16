import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { Category, CategorySchema } from './entities/category.entity';
import { compact } from 'es-toolkit';

@Injectable()
export class CategoryRepository {
  constructor(protected readonly dbService: DbService) {}

  async list(): Promise<Category[]> {
    const result = await this.dbService.query('SELECT * FROM categories');

    const categories = compact(
      (result?.rows ?? []).map((c) => CategorySchema.validateSync(c)),
    );

    return categories;
  }
}
