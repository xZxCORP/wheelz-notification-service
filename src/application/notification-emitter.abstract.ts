import { Notification } from '../domain/notification.js'

export interface AbstractNotificationEmitter {
  emit(notification: Notification): Promise<void>
}
