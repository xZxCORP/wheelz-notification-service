import { AbstractLogger } from '../application/logger.abstract.js'
import { AbstractNotificationEmitter } from '../application/notification-emitter.abstract.js'
import { Notification } from '../domain/notification.js'

export class EmailNotificationEmitter implements AbstractNotificationEmitter {
  constructor(private logger: AbstractLogger) {}
  emit(notification: Notification): Promise<void> {
    this.logger.info('Emit notification with email', notification)
    return Promise.resolve()
  }
}
