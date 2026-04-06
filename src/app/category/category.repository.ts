import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { Category, CategoryRaw, schema } from './entities/category.entity';
import { compact } from 'es-toolkit';

const arrayToTree = (categories: CategoryRaw[]): Category[] => {
  return categories.reduce<Category[]>((items, item) => {
    items.push({
      id: item.id,
      name: item.name,
      children: [],
    });

    return items;
  }, []);
};

@Injectable()
export class CategoryRepository {
  constructor(protected readonly dbService: DbService) {}

  async list(): Promise<Category[]> {
    const result = await this.dbService.query('SELECT * FROM categories');

    const rawCategories = compact(
      (result?.rows ?? []).map((c) => schema.validateSync(c)),
    );

    return arrayToTree(rawCategories);
  }
}
