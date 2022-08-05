import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import 'dotenv/config';
import { CustomLogger } from './modules/logger/services/logger.service';
import { AppModule } from './app.module';

const PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
const LOGGING_LEVEL: number =
  parseInt(process.env.LOGGING_LEVEL as string, 10) || 2;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const DOC_API = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );

  SwaggerModule.setup('doc', app, parse(DOC_API));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useLogger(new CustomLogger(LOGGING_LEVEL));

  await app.listen(PORT, () => console.log(`🚀  Server ready on port ${PORT}`));
};

bootstrap();
