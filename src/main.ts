import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TransformInterceptor } from './core/transform.interceptor';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'], //v1,v2
    // prefix: 'api/v'
  });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
