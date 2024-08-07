import { Context, Effect } from 'effect';

import { DomainError } from '../../domain/errors/domain.error.js';
import { NotificationValidation } from '../../domain/services/notification-validation.service.js';
import { ApplicationError } from '../errors/application.error.js';
import { Logger } from '../ports/logger.port.js';
import { MessageEmitter } from '../ports/message-emitter.port.js';
import { NotificationTransformer } from '../ports/notification-transformer.port.js';
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
    private messageEmitter: MessageEmitter,
    private notificationValidation: NotificationValidation,
    private notificationTransformer: NotificationTransformer
  ) {}
  execute(notificationData: string) {
    return Effect.gen(this, function* () {
      yield* this.logger.info(`Processing notification`);

      const validatedNotification = yield* this.notificationValidation.validate(notificationData);
      const formattedMessage = yield* this.notificationTransformer.transform(validatedNotification);

      yield* this.messageEmitter.emit(formattedMessage);
    });
  }
}
