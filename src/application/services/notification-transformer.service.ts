import { Context, Effect } from 'effect';

import { Message } from '../../domain/entities/message.entity.js';
import { Notification } from '../../domain/entities/notification.entity.js';
import { UnsupportedNotificationTypeError } from '../../domain/errors/domain.error.js';

export interface NotificationTransformer {
  transform(
    notification: Notification
  ): Effect.Effect<Message, UnsupportedNotificationTypeError, never>;
}
export class NotificationTransformerService extends Context.Tag('NotificationTransformer')<
  NotificationTransformer,
  NotificationTransformer
>() {}
export class NotificationTransformerServiceImpl implements NotificationTransformer {
  transform(notification: Notification) {
    switch (notification.type) {
      case 'new_user': {
        return Effect.succeed({
          body: 'Welcome',
          recipient: notification.newUser.email,
          subject: 'Welcome',
        } as Message);
      }

      default: {
        return Effect.fail(new UnsupportedNotificationTypeError({ type: notification.type }));
      }
    }
  }
}
