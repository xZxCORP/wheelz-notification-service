import type { Result } from 'neverthrow';

import type { Message } from '../entities/message.entity.js';
import type { Notification } from '../entities/notification.entity.js';
import type { NotificationTransformerError } from '../errors/domain.error.js';

export interface NotificationTransformerPort {
  transform(notification: Notification): Result<Message, NotificationTransformerError>;
}
