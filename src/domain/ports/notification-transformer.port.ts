import { Result } from 'neverthrow';

import { Message } from '../entities/message.entity.js';
import { Notification } from '../entities/notification.entity.js';
import { NotificationTransformerError } from '../errors/domain.error.js';

export interface NotificationTransformerPort {
  transform(notification: Notification): Result<Message, NotificationTransformerError>;
}
