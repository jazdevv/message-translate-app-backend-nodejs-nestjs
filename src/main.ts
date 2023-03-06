import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors:true});
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  
  await app.listen(process.env.PORT);
}
bootstrap();
