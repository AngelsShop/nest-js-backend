import { Module } from '@nestjs/common';
import { ProductModule } from './app/product/products.module';
import { CategoryModule } from './app/category/category.module';

@Module({
  imports: [ProductModule, CategoryModule],
})
export class AppModule {}
