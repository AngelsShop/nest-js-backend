import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DbService {
  constructor(private readonly configService: ConfigService) {}

  async query(query: string, params: unknown[] | undefined = undefined) {
    const client: Client = new Client({
      host: this.configService.get<string>('DB_HOST'),
      user: this.configService.get<string>('DB_USER'),
      database: this.configService.get<string>('DB_NAME'),
      port: this.configService.get<number>('DB_PORT'),
    });

    await client.connect();

    try {
      const res = await client.query(query, params);

      return res;
    } catch (err) {
      console.error(err);
    } finally {
      await client.end();
    }
  }
}
