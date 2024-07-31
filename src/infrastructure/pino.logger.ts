/* eslint-disable @typescript-eslint/no-explicit-any */
import { pino } from 'pino'

import { AbstractLogger } from '../application/logger.abstract.js'
import { config } from '../config.js'

export class PinoLogger implements AbstractLogger {
  private logger: pino.Logger

  constructor() {
    this.logger = pino({
      level: config.LOG_LEVEL,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    })
  }
  trace(message?: any, ...optionalParameters: any[]): void {
    this.logger.trace(message, ...optionalParameters)
  }

  debug(message?: any, ...optionalParameters: any[]): void {
    this.logger.debug(message, ...optionalParameters)
  }

  info(message?: any, ...optionalParameters: any[]): void {
    this.logger.info(message, ...optionalParameters)
  }

  warn(message?: any, ...optionalParameters: any[]): void {
    this.logger.warn(message, ...optionalParameters)
  }

  error(message?: any, ...optionalParameters: any[]): void {
    this.logger.error(message, ...optionalParameters)
  }
}
