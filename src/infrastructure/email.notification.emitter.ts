import { logger } from '../app.js'
import { AbstractNotificationEmitter } from '../application/notification-emitter.abstract.js'
import { Notification } from '../domain/notification.js'

export class EmailNotificationEmitter implements AbstractNotificationEmitter {
  emit(notification: Notification): Promise<void> {
    logger.info('emit notification with email', notification)
    return Promise.resolve()
  }
}
