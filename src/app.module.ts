import { Module } from '@nestjs/common';
import { ProductModule } from './app/product/products.module';
import { CategoryModule } from './app/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './common/service/db/db.module';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from '$app/user/user.module';
import { FilesModule } from '$app/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductModule,
    CategoryModule,
    UserModule,
    FilesModule,
    DbModule,
    AuthModule,
  ],
})
export class AppModule {}
