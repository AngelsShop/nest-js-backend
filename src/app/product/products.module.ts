import { Module } from '@nestjs/common';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { DbModule } from 'src/common/service/db/db.module';
import { ProductsRepository } from './products.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductsRepository],
  imports: [DbModule],
})
export class ProductModule {}
