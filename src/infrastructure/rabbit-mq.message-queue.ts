import amqp from 'amqplib'

import { MessageQueue } from '../application/message-queue.abstract.js'

export class RabbitMQMessageQueue implements MessageQueue {
  private connection: amqp.Connection | undefined = undefined
  private channel: amqp.Channel | undefined = undefined

  constructor(private url: string) {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect(this.url)
    this.channel = await this.connection.createChannel()
  }

  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.close()
    }
    if (this.connection) {
      await this.connection.close()
    }
  }

  async consume(queue: string, callback: (message: unknown) => Promise<void>): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ not connected')
    }

    await this.channel.assertQueue(queue, { durable: true })
    await this.channel.consume(queue, async (message) => {
      if (message) {
        try {
          const content = JSON.parse(message.content.toString())
          await callback(content)
          this.channel!.ack(message)
        } catch (error) {
          console.error('Error processing message:', error)
          this.channel!.nack(message)
        }
      }
    })
  }
}
