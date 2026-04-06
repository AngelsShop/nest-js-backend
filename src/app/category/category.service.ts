import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  list(): Promise<Category[]> {
    return this.categoryRepository.list();
  }
}
