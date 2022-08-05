import { LoggerService, Logger } from '@nestjs/common';

enum LoggingLevels {
  debug = 0,
  verbose = 1,
  log = 2,
  warn = 3,
  error = 4,
}

export class CustomLogger implements LoggerService {
  private readonly levelLog: number;
  private logger = new Logger();

  constructor(level: number) {
    this.levelLog = level;
  }

  debug?(message: string) {
    if (this.levelLog === LoggingLevels['debug']) {
      this.logger.debug(message);
    }
  }

  verbose?(message: string) {
    if (this.levelLog === LoggingLevels['verbose']) {
      this.logger.verbose(message);
    }
  }

  log(message: string) {
    if (this.levelLog === LoggingLevels['log']) {
      this.logger.log(message);
    }
  }

  warn(message: string) {
    if (this.levelLog === LoggingLevels['warn']) {
      this.logger.warn(message);
    }
  }

  error(message: string) {
    if (this.levelLog === LoggingLevels['error']) {
      this.logger.error(message);
    }
  }
}
