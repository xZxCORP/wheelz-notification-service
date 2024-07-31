import { Config } from '../config.js'
import { notificationSchema } from '../domain/notification.js'
import { AbstractLogger } from './logger.abstract.js'
import { AbstractMessageQueue } from './message-queue.abstract.js'
import { AbstractNotificationEmitter } from './notification-emitter.abstract.js'

export class Application {
  constructor(
    private logger: AbstractLogger,
    private notificationEmitter: AbstractNotificationEmitter,
    private messageQueue: AbstractMessageQueue,
    private config: Config
  ) {}

  private async processNotification(message: unknown): Promise<void> {
    try {
      const notification = notificationSchema.parse(message)
      await this.notificationEmitter.emit(notification)
      this.logger.info('Notification emit successfully', notification)
    } catch (error) {
      this.logger.error('Failed to process or emit notification', error)
    }
  }

  async run(): Promise<void> {
    try {
      await this.messageQueue.connect()
      this.logger.info('Connected to message queue')

      await this.messageQueue.consume(
        this.config.NOTIFICATION_QUEUE,
        this.processNotification.bind(this)
      )

      this.logger.info(
        `Notification emitter is running in ${this.config.NODE_ENV} mode and consuming messages from the queue`
      )
    } catch (error) {
      this.logger.error('Error starting notification emitter', error)
      await this.messageQueue.disconnect()
      throw error
    }
  }
}
