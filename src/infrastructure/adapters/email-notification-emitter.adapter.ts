import { Effect } from 'effect';

import { EmissionFailedError } from '../../application/errors/application.error.js';
import { Logger } from '../../application/ports/logger.port.js';
import { NotificationEmitter } from '../../application/ports/notification-emitter.port.js';
import { Notification } from '../../domain/entities/notification.entity.js';
export class EmailNotificationEmitterAdapter implements NotificationEmitter {
  constructor(private readonly logger: Logger) {}
  emit(notification: Notification): Effect.Effect<void, EmissionFailedError, never> {
    return Effect.gen(this, function* () {
      yield* this.logger.info('emit email', notification);
    });
  }
}
