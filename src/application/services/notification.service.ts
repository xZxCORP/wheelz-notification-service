import type { ResultAsync } from 'neverthrow';

import type { NotificationQueuePort } from '../../domain/ports/notification-queue.port.js';
import type { ProcessNotificationUseCase } from '../../domain/use-cases/process-notification.use-case.js';
import type { NotificationProcessingError } from '../errors/application.error.js';

export class NotificationService {
  constructor(
    private notificationQueue: NotificationQueuePort,
    private processNotification: ProcessNotificationUseCase
  ) {}

  start(): ResultAsync<void, NotificationProcessingError> {
    return this.notificationQueue.consume(async (notificationResult) => {
      await notificationResult.asyncAndThen((notification) =>
        this.processNotification.execute(notification)
      );
    });
  }
}
