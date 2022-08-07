import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, baseUrl, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;

      Logger.log(
        'HTTP',
        `status code: ${statusCode}, method: ${method}, url: ${baseUrl}, query parameters: ${JSON.stringify(
          query,
        )}, body: ${JSON.stringify(body)}`,
      );
    });

    next();
  }
}
