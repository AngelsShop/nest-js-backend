import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, QueryResultRow } from 'pg';

@Injectable()
export class DbService {
  constructor(private readonly configService: ConfigService) {}
  private readonly logger = new Logger(DbService.name);

  async query<R extends QueryResultRow = any>(
    query: string,
    params: unknown[] | undefined = undefined,
  ) {
    const client: Client = new Client({
      host: this.configService.get<string>('POSTGRES_HOST'),
      user: this.configService.get<string>('POSTGRES_USER'),
      database: this.configService.get<string>('POSTGRES_DB'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
    });

    await client.connect();

    try {
      this.logger.log(query);
      const res = await client.query<R>(query, params);

      return res;
    } catch (err) {
      this.logger.error(err);
    } finally {
      await client.end();
    }
  }
}
