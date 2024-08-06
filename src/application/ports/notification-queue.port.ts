import { Context, Effect } from 'effect';

import { QueueConnectionFailedError } from '../errors/application.error.js';

export interface NotificationQueue {
  consume(
    queueName: string,
    callback: (data: string) => Effect.Effect<void, void, void>
  ): Effect.Effect<void, QueueConnectionFailedError, never>;
}

export class NotificationQueueService extends Context.Tag('NotificationQueue')<
  NotificationQueue,
  NotificationQueue
>() {}
