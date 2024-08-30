import { ResultAsync } from 'neverthrow';

import { LoggerPort } from '../../domain/ports/logger.port.js';
import { NotificationQueuePort } from '../../domain/ports/notification-queue.port.js';
import { ProcessNotificationUseCase } from '../../domain/use-cases/process-notification.use-case.js';
import { NotificationProcessingError } from '../errors/application.error.js';

export class NotificationService {
  constructor(
    private notificationQueue: NotificationQueuePort,
    private processNotification: ProcessNotificationUseCase,
    private logger: LoggerPort
  ) {}

  start(): ResultAsync<void, NotificationProcessingError> {
    return this.notificationQueue.consume(async (notificationResult) => {
      await notificationResult.asyncAndThen((notification) =>
        this.processNotification.execute(notification)
      );
    });
  }
}
