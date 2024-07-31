/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AbstractLogger {
  trace(message?: any, ...optionalParameters: any[]): void
  debug(message?: any, ...optionalParameters: any[]): void
  info(message?: any, ...optionalParameters: any[]): void
  warn(message?: any, ...optionalParameters: any[]): void
  error(message?: any, ...optionalParameters: any[]): void
}
