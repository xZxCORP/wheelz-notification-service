import { Context, Effect } from 'effect';

export interface Logger {
  info: (...message: ReadonlyArray<any>) => Effect.Effect<void, never, never>;
  error: (...message: ReadonlyArray<any>) => Effect.Effect<void, never, never>;
  warn: (...message: ReadonlyArray<any>) => Effect.Effect<void, never, never>;
  debug: (...message: ReadonlyArray<any>) => Effect.Effect<void, never, never>;
}
export class LoggerService extends Context.Tag('Logger')<Logger, Logger>() {}
