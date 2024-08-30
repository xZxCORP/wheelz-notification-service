import { Result } from 'neverthrow';

import { QueueError } from '../../infrastructure/errors/infrastructure.error.js';
import { Notification } from '../entities/notification.entity.js';

export interface NotificationQueuePort {
  consume(): AsyncIterableIterator<Result<Notification, QueueError>>;
}
