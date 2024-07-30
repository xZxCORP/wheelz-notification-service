import { pino } from 'pino'

import { config } from './config.js'
import { notificationSchema } from './domain/notification.js'
import { EmailNotificationEmitter } from './infrastructure/email.notification.emitter.js'
import { RabbitMQMessageQueue } from './infrastructure/rabbit-mq.message-queue.js'

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

const emailNotificationEmitter = new EmailNotificationEmitter()

const rabbitMqMessageQueue = new RabbitMQMessageQueue(config.RABBITMQ_URL)
async function processNotification(message: unknown) {
  try {
    const notification = notificationSchema.parse(message)
    await emailNotificationEmitter.emit(notification)
    logger.info(notification, 'Notification emit successfully')
  } catch (error) {
    logger.error({ error }, 'Failed to process or emit notification')
  }
}
export async function runApplication() {
  try {
    await rabbitMqMessageQueue.connect()
    logger.info('Connected to RabbitMQ')

    await rabbitMqMessageQueue.consume(config.NOTIFICATION_QUEUE, processNotification)

    logger.info(
      `Notification emitter is running in ${config.NODE_ENV} mode and consuming messages from RabbitMQ`
    )
  } catch (error) {
    logger.fatal({ error }, 'Error starting notification emitter')
    await rabbitMqMessageQueue.disconnect()
    throw error
  }
}

process.on('SIGINT', async () => {
  logger.info('Shutting down...')
  await rabbitMqMessageQueue.disconnect()
  process.exit(0)
})
