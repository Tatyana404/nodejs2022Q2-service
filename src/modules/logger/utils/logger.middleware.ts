import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from './../services/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, baseUrl, url, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      this.logger.log(
        `${new Date().toLocaleString()} ${method} ${baseUrl} ${url} ${JSON.stringify(
          body,
        )} ${statusCode}`,
      );
    });

    next();
  }
}
