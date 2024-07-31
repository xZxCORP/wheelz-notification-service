import { AbstractLogger } from '../../src/application/logger.abstract.js'

/* eslint-disable @typescript-eslint/no-explicit-any */
export class MockLogger implements AbstractLogger {
  public logs: Array<{
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error'
    message?: any
    optionalParameters: any[]
  }> = []

  trace(message?: any, ...optionalParameters: any[]): void {
    this.logs.push({ level: 'trace', message, optionalParameters })
  }

  debug(message?: any, ...optionalParameters: any[]): void {
    this.logs.push({ level: 'debug', message, optionalParameters })
  }

  info(message?: any, ...optionalParameters: any[]): void {
    this.logs.push({ level: 'info', message, optionalParameters })
  }

  warn(message?: any, ...optionalParameters: any[]): void {
    this.logs.push({ level: 'warn', message, optionalParameters })
  }

  error(message?: any, ...optionalParameters: any[]): void {
    this.logs.push({ level: 'error', message, optionalParameters })
  }

  getLastLog() {
    return this.logs.at(-1)
  }

  clearLogs() {
    this.logs = []
  }
}
