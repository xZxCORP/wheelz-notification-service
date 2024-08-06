import { Effect } from 'effect';

import { NotificationValidationService } from '../../domain/services/notification-validation.service.js';
import { LoggerService } from '../ports/logger.port.js';
import { NotificationEmitterService } from '../ports/notification-emitter.port.js';

export class ProcessNotificationUseCase {
  execute(notificationData: unknown) {
    return Effect.gen(function* () {
      const logger = yield* LoggerService;
      const notificationEmitter = yield* NotificationEmitterService;
      const notificationValidation = yield* NotificationValidationService;

      yield* logger.info(`Processing notification`);

      const validatedNotification = yield* notificationValidation.validate(notificationData);

      yield* notificationEmitter
        .emit(validatedNotification)
        .pipe(
          Effect.tapError((error) =>
            logger.error(`Error emitting notification: ${validatedNotification.id}`, error)
          )
        );
    });
  }
}
