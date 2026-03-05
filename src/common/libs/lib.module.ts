import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from './prisma.service';
import { TokenGeneratorService } from './token-generator.service';
import { WinstonLoggerService } from './winston-logger.service';
import { JwtConfigService } from './jwt-config.service';

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
  providers: [PrismaService, TokenGeneratorService, WinstonLoggerService],
  exports: [PrismaService, TokenGeneratorService, WinstonLoggerService],
})
export class LibModule {}
