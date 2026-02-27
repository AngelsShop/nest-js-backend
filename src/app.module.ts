import { Module } from '@nestjs/common';
import { ProductModule } from './app/product/products.module';
import { CategoryModule } from './app/category/category.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProductModule, CategoryModule, ConfigModule.forRoot()],
})
export class AppModule {}
