import { existsSync, mkdirSync, appendFileSync } from 'fs';
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

  writingToFile(context: string, message: string, fileName: string) {
    super.setContext(context);

    if (existsSync('logs')) {
      appendFileSync(
        `logs/${fileName}.log`,
        `timestamp: ${new Date().toLocaleString()}, ${message} \n`,
      );
    } else {
      mkdirSync('logs');
      appendFileSync(
        `logs/${fileName}.log`,
        `timestamp: ${new Date().toLocaleString()}, ${message} \n`,
      );
    }
  }

  debug(context: string, message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn'] ||
      this.levelLog === LoggingLevels['log'] ||
      this.levelLog === LoggingLevels['verbose'] ||
      this.levelLog === LoggingLevels['debug']
    ) {
      super.debug(message);
      this.writingToFile(context, message, 'debug');
    }
  }

  verbose(context: string, message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn'] ||
      this.levelLog === LoggingLevels['log'] ||
      this.levelLog === LoggingLevels['verbose']
    ) {
      super.verbose(message);
      this.writingToFile(context, message, 'verbose');
    }
  }

  log(context: string, message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn'] ||
      this.levelLog === LoggingLevels['log']
    ) {
      super.log(message);
      this.writingToFile(context, message, 'log');
    }
  }

  warn(context: string, message: string) {
    if (
      this.levelLog === LoggingLevels['error'] ||
      this.levelLog === LoggingLevels['warn']
    ) {
      super.warn(message);
      this.writingToFile(context, message, 'warn');
    }
  }

  error(context: string, message: string) {
    if (this.levelLog === LoggingLevels['error']) {
      super.error(message);
      this.writingToFile(context, message, 'error');
    }
  }
}
