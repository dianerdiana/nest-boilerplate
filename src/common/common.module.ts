import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfigService } from './libs/jwt-config.service';
import { PrismaService } from './libs/prisma.service';
import { WinstonLoggerService } from './libs/winston-logger.service';
import { PaginationService } from './services/pagination.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [PrismaService, WinstonLoggerService, PaginationService],
  exports: [PrismaService, WinstonLoggerService, PaginationService],
})
export class CommonModule {}
