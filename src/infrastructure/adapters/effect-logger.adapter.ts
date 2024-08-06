import { Effect } from 'effect';

import { Logger } from '../../application/ports/logger.port.js';

export class EffectLoggerAdapter implements Logger {
  info = (...message: ReadonlyArray<any>) => Effect.logInfo(message);
  error = (...message: ReadonlyArray<any>) => Effect.logError(message);
  warn = (...message: ReadonlyArray<any>) => Effect.logWarning(message);
  debug = (...message: ReadonlyArray<any>) => Effect.logDebug(message);
}
