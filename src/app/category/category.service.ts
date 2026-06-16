import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async list(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.list();

    return categories.reduce<CategoryDto[]>((items, item) => {
      items.push({
        id: item.id,
        name: item.name,
        children: [],
      });

      return items;
    }, []);
  }
}
