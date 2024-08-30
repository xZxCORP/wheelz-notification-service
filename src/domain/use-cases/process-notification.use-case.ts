import { ResultAsync } from 'neverthrow';

import { NotificationProcessingError } from '../../application/errors/application.error.js';
import { Notification } from '../entities/notification.entity.js';

export interface ProcessNotificationUseCase {
  execute(notification: Notification): ResultAsync<void, NotificationProcessingError>;
}
