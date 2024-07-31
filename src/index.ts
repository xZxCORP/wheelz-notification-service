/* eslint-disable unicorn/no-process-exit */
/* eslint-disable unicorn/prefer-top-level-await */
import { Application } from './application/application.js'
import { config } from './config.js'
import { EmailNotificationEmitter } from './infrastructure/email.notification-emitter.js'
import { PinoLogger } from './infrastructure/pino.logger.js'
import { RabbitMQMessageQueue } from './infrastructure/rabbit-mq.message-queue.js'

const logger = new PinoLogger()
const emailNotificationEmitter = new EmailNotificationEmitter(logger)
const rabbitMqMessageQueue = new RabbitMQMessageQueue(config.RABBITMQ_URL)

const app = new Application(logger, emailNotificationEmitter, rabbitMqMessageQueue, config)

app.run().catch((error) => {
  console.error('Application failed to start', error)
  process.exit(1)
})
