import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { WinstonLoggerService } from './common/libs/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const logger = app.get(WinstonLoggerService);

  // Logger
  app.useLogger(logger);

  const port = configService.get<number>('port') ?? 3000;
  await app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
  });
}

bootstrap().catch((err) => console.log(err));
