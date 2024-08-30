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
    return ResultAsync.fromPromise(
      this.runService(),
      (error): NotificationProcessingError =>
        new NotificationProcessingError(
          `Failed to start notification service: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
    );
  }

  private async runService(): Promise<void> {
    for await (const notificationResult of this.notificationQueue.consume()) {
      await notificationResult
        .asyncAndThen((notification) => this.processNotification.execute(notification))
        .match(
          () => this.logger.info('Notification processed successfully'),
          (error) => this.logger.error('Error processing notification:', error)
        );
    }
  }
}
