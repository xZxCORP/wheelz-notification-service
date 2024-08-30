import { ResultAsync } from 'neverthrow';

import { Notification } from '../../domain/entities/notification.entity.js';
import { LoggerPort } from '../../domain/ports/logger.port.js';
import { MessageEmitterPort } from '../../domain/ports/message-emitter.port.js';
import { NotificationTransformerPort } from '../../domain/ports/notification-transformer.port.js';
import { MessageSchema } from '../../domain/schemas/message.schema.js';
import { NotificationSchema } from '../../domain/schemas/notification.schema.js';
import { ProcessNotificationUseCase } from '../../domain/use-cases/process-notification.use-case.js';
import { Validator } from '../../domain/validation/validator.js';
import { NotificationProcessingError } from '../errors/application.error.js';

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
      })
      .map(() => {
        this.logger.info('Notification processed successfully');
      })
      .mapErr((error) => {
        this.logger.error('Error processing notification:', { error });
        return new NotificationProcessingError(
          `Failed to process notification: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      });
  }
}
