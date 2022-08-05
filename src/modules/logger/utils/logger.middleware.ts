import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

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
