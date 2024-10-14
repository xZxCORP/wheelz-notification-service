import type { Result, ResultAsync } from 'neverthrow';

import type { QueueError } from '../../infrastructure/errors/infrastructure.error.js';
import type { Notification } from '../entities/notification.entity.js';

export interface NotificationQueuePort {
  consume(
    callback: (result: Result<Notification, QueueError>) => void
  ): ResultAsync<void, QueueError>;
}
