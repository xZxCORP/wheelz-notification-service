import winston from 'winston';

import type { LoggerPort } from '../../../domain/ports/logger.port.js';

export class WinstonLogger implements LoggerPort {
  private logger: winston.Logger;

  constructor(logLevel: string) {
    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint({ colorize: true })
      ),
      transports: [new winston.transports.Console()],
    });
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }
}
