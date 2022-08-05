import { LoggerService } from '@nestjs/common';

enum LoggingLevels {
  debug = 0,
  verbose = 1,
  log = 2,
  warn = 3,
  error = 4,
}

export class CustomLogger implements LoggerService {
  private readonly levelLog: number;

  constructor(level: number) {
    this.levelLog = level;
  }

  debug?(message: string) {
    if (this.levelLog === LoggingLevels['debug']) {
      console.debug(message);
    }
  }

  verbose?(message: string) {
    if (this.levelLog === LoggingLevels['verbose']) {
      console.log(message);
    }
  }

  log(message: string) {
    if (this.levelLog === LoggingLevels['log']) {
      console.log(message);
    }
  }

  warn(message: string) {
    if (this.levelLog === LoggingLevels['warn']) {
      console.warn(message);
    }
  }

  error(message: string) {
    if (this.levelLog === LoggingLevels['error']) {
      console.error(message);
    }
  }
}
