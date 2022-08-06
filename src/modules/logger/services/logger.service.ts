import { ConsoleLogger } from '@nestjs/common';
import 'dotenv/config';

enum LoggingLevels {
  debug = 0,
  verbose = 1,
  log = 2,
  warn = 3,
  error = 4,
}

export class CustomLogger extends ConsoleLogger {
  private readonly levelLog: number;

  constructor() {
    super();
    this.levelLog = parseInt(process.env.LOGGING_LEVEL as string, 10) || 4;
  }

  debug(message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn'] ||
      this.levelLog === LoggingLevels['log'] ||
      this.levelLog === LoggingLevels['verbose'] ||
      this.levelLog === LoggingLevels['debug']
    ) {
      console.debug(message);
    }
  }

  verbose(message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn'] ||
      this.levelLog === LoggingLevels['log'] ||
      this.levelLog === LoggingLevels['verbose']
    ) {
      console.log(message);
    }
  }

  log(message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn'] ||
      this.levelLog === LoggingLevels['log']
    ) {
      console.log(message);
    }
  }

  warn(message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn']
    ) {
      console.warn(message);
    }
  }

  error(message: string) {
    if (this.levelLog === LoggingLevels['error']) {
      console.error(message);
    }
  }
}
