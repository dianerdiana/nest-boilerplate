import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';

import configuration from './config/configuration';
import { ConfigurationSchema } from './config/schema/configuration.schema';

import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LibModule } from './common/libs/lib.module';

import { CaslModule } from './modules/@casl/casl.module';
import { AuthenticationModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      validate: (config) => ConfigurationSchema.parse(config),
      load: [configuration],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    LibModule,
    AuthenticationModule,
    CaslModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector: Reflector) => new ClassSerializerInterceptor(reflector),
    },
  ],
})
export class AppModule {}
