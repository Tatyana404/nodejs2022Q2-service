import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import 'dotenv/config';
import { AppModule } from './app.module';

const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const DOC_API = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );

  SwaggerModule.setup('doc', app, parse(DOC_API));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT, () => console.log(`🚀  Server ready on port ${PORT}`));
};

bootstrap();
