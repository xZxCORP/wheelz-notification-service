import { Context, Effect } from 'effect';

import { Notification } from '../../domain/entities/notification.entity.js';
import { EmissionFailedError } from '../errors/application.error.js';

export interface NotificationEmitter {
  emit: (notification: Notification) => Effect.Effect<void, EmissionFailedError, never>;
}
export class NotificationEmitterService extends Context.Tag('NotificationEmitter')<
  NotificationEmitter,
  NotificationEmitter
>() {}
