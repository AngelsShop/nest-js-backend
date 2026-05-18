import { Module } from '@nestjs/common';
import { ProductModule } from './app/product/products.module';
import { CategoryModule } from './app/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './common/service/db/db.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    DbModule,
    ConfigModule.forRoot(),
    AuthModule,
  ],
})
export class AppModule {}
