import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [DbService],
  exports: [DbService],
  imports: [ConfigModule],
})
export class DbModule {}
