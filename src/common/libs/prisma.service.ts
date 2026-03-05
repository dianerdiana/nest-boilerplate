import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient, Prisma } from '../../../generated/prisma/client';
import { WinstonLoggerService } from './winston-logger.service';

const clientOptions = {
  log: [
    { emit: 'event' as const, level: 'info' as const },
    { emit: 'event' as const, level: 'query' as const },
    { emit: 'event' as const, level: 'warn' as const },
    { emit: 'event' as const, level: 'error' as const },
  ],
  adapter: new PrismaMariaDb({}),
} satisfies Prisma.PrismaClientOptions;

@Injectable()
export class PrismaService
  extends PrismaClient<typeof clientOptions, 'info' | 'query' | 'warn' | 'error'>
  implements OnModuleInit
{
  private readonly logger: WinstonLoggerService;

  constructor(logger: WinstonLoggerService, configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.getOrThrow<string>('database.host'),
      port: configService.getOrThrow<number>('database.port') ?? 3306,
      user: configService.getOrThrow<string>('database.user'),
      password: configService.getOrThrow<string>('database.password'),
      database: configService.getOrThrow<string>('database.database'),

      // membantu diagnosis / jaringan lambat
      connectTimeout: 10000,
    });
    super({ ...clientOptions, adapter });

    this.logger = logger;
  }

  async onModuleInit() {
    this.$on('info', (e) => this.logger.log(e.message));
    this.$on('warn', (e) => this.logger.warn(e.message));
    this.$on('error', (e) => this.logger.error(e.message));
    this.$on('query', (e) => this.logger.log(e.query));

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
