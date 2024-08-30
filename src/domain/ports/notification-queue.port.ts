import { Result, ResultAsync } from 'neverthrow';

import { QueueError } from '../../infrastructure/errors/infrastructure.error.js';
import { Notification } from '../entities/notification.entity.js';

export interface NotificationQueuePort {
  consume(
    callback: (result: Result<Notification, QueueError>) => void
  ): ResultAsync<void, QueueError>;
}
