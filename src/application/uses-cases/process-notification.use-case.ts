import { Context, Effect } from 'effect';

import { DomainError } from '../../domain/errors/domain.error.js';
import { NotificationValidation } from '../../domain/services/notification-validation.service.js';
import { ApplicationError } from '../errors/application.error.js';
import { Logger } from '../ports/logger.port.js';
import { NotificationEmitter } from '../ports/notification-emitter.port.js';
export interface ProcessNotificationUseCase {
  execute(notificationData: string): Effect.Effect<void, DomainError | ApplicationError, never>;
}
export class ProcessNotificationUseCaseService extends Context.Tag('ProcessNotificationUseCase')<
  ProcessNotificationUseCase,
  ProcessNotificationUseCase
>() {}
export class ProcessNotificationUseCaseServiceImpl implements ProcessNotificationUseCase {
  constructor(
    private logger: Logger,
    private notificationEmitter: NotificationEmitter,
    private notificationValidation: NotificationValidation
  ) {}
  execute(notificationData: string) {
    return Effect.gen(this, function* () {
      yield* this.logger.info(`Processing notification`);

      const validatedNotification = yield* this.notificationValidation.validate(notificationData);

      yield* this.notificationEmitter.emit(validatedNotification);
    });
  }
}
