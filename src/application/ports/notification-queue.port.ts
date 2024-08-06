import { Context, Effect } from 'effect';

import { Notification } from '../../domain/entities/notification.entity.js';

export interface NotificationQueue {
  consume(
    queueName: string,
    callback: (notification: Notification) => Effect.Effect<void, never, never>
  ): Effect.Effect<void, never, never>;
}

export class NotificationQueueService extends Context.Tag('NotificationQueue')<
  NotificationQueue,
  NotificationQueue
>() {}
