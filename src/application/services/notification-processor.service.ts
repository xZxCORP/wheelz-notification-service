import type { ResultAsync } from 'neverthrow';

import type { Notification } from '../../domain/entities/notification.entity.js';
import type { LoggerPort } from '../../domain/ports/logger.port.js';
import type { MessageEmitterPort } from '../../domain/ports/message-emitter.port.js';
import type { NotificationTransformerPort } from '../../domain/ports/notification-transformer.port.js';
import type { MessageSchema } from '../../domain/schemas/message.schema.js';
import type { NotificationSchema } from '../../domain/schemas/notification.schema.js';
import type { ProcessNotificationUseCase } from '../../domain/use-cases/process-notification.use-case.js';
import type { Validator } from '../../domain/validation/validator.js';
import type { NotificationProcessingError } from '../errors/application.error.js';

export class NotificationProcessorService implements ProcessNotificationUseCase {
  constructor(
    private messageEmitter: MessageEmitterPort,
    private validator: Validator,
    private notificationSchema: NotificationSchema,
    private notificationTransformer: NotificationTransformerPort,
    private messageSchema: MessageSchema,
    private logger: LoggerPort
  ) {}

  execute(notification: Notification): ResultAsync<void, NotificationProcessingError> {
    this.logger.info('Processing notification:', { notification });
    return this.validator
      .validate(this.notificationSchema, notification)
      .andThen((notification) => {
        this.logger.debug('Notification validated successfully', { notification });
        return this.notificationTransformer.transform(notification);
      })
      .andThen((message) => {
        this.logger.debug('Notification transformed successfully', { message });
        return this.validator.validate(this.messageSchema, message);
      })
      .asyncAndThen((message) => {
        this.logger.debug('Message validated successfully', { message });
        return this.messageEmitter.send(message);
      });
  }
}
