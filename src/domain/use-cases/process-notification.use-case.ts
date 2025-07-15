import type { ResultAsync } from 'neverthrow';

import type { NotificationProcessingError } from '../../application/errors/application.error.js';
import type { Notification } from '../entities/notification.entity.js';

export interface ProcessNotificationUseCase {
  execute(notification: Notification): ResultAsync<void, NotificationProcessingError>;
}
