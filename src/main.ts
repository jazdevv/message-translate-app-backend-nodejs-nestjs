import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
  
  //PUBLIC FOLDERS FOR TEMPLATE ENGINE
  app.useStaticAssets(join(__dirname,'..',  '/public'))  
  // SET TEMPLATE ENGINE
  app.setBaseViewsDir(join(__dirname,'..', '/views'));
  app.engine('hbs', hbs({ extname: 'hbs' }));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
