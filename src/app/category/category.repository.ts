import { Injectable } from '@nestjs/common';
import { DbService } from 'src/common/service/db/db.service';
import { Category, CategoryRaw, dbSchema } from './entities/category.entity';
import { compact } from 'es-toolkit';

const arrayToTree = (categories: CategoryRaw[]): Category[] => {
  categories.map((item) => [item.id, item.parent_category_id]);

  const rootCategoriesMap = categories.reduce<Record<string, CategoryRaw>>(
    (map, item) => {
      if (!item.parent_category_id) {
        map[item.id] = item;
      }

      return map;
    },
    {},
  );

  categories.reduce<Category[]>((items, item) => {
    items.push({
      id: item.id,
      name: item.name,
      children: [],
    });

    return items;
  }, []);

  return [];
};

@Injectable()
export class CategoryRepository {
  constructor(protected readonly dbService: DbService) {}

  async list(): Promise<Category[]> {
    const result = await this.dbService.query('SELECT * FROM categories');

    const rawCategories = compact(
      (result?.rows ?? []).map((c) => dbSchema.validateSync(c)),
    );

    console.log(arrayToTree(rawCategories));

    const categories = [];

    return categories;
  }

  async getById(id: string): Promise<Category | undefined> {
    const result = await this.dbService.query(
      'SELECT * FROM categories WHERE id = $1 OR parent_category_id = $1',
      [id],
    );
    const category = result?.rows[0];

    if (!category) {
      return;
    }

    return category as Category;
  }
}
