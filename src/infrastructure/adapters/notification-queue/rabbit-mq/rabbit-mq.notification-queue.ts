import amqp from 'amqplib';
import type { Result } from 'neverthrow';
import { err, errAsync, ok, okAsync, ResultAsync } from 'neverthrow';

import type { Config } from '../../../../domain/entities/config.entity.js';
import type { Notification } from '../../../../domain/entities/notification.entity.js';
import type { AppError } from '../../../../domain/errors/app.error.js';
import type { LoggerPort } from '../../../../domain/ports/logger.port.js';
import type { NotificationQueuePort } from '../../../../domain/ports/notification-queue.port.js';
import { QueueError } from '../../../errors/infrastructure.error.js';
import type { ManagedResource } from '../../../managed.resource.js';
export class RabbitMQNotificationQueue implements ManagedResource, NotificationQueuePort {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(
    private config: Config,
    private readonly logger: LoggerPort
  ) {}

  initialize(): ResultAsync<void, AppError> {
    this.logger.info(`Connecting to RabbitMQ at ${this.config.notificationQueue.url}`);

    return ResultAsync.fromPromise(
      amqp.connect(this.config.notificationQueue.url),
      (error) => new QueueError(`Failed to connect to RabbitMQ: ${error}`)
    )
      .andThen((connection) => {
        this.connection = connection;
        return ResultAsync.fromPromise(
          connection.createChannel(),
          (error) => new QueueError(`Failed to create channel: ${error}`)
        );
      })
      .andThen((channel) => {
        this.channel = channel;
        return ResultAsync.fromPromise(
          channel.assertQueue(this.config.notificationQueue.queueName),
          (error) => new QueueError(`Failed to assert queue: ${error}`)
        );
      })
      .map(() => {
        this.logger.info('Successfully connected to RabbitMQ and asserted queue');
      });
  }
  dispose(): ResultAsync<void, QueueError> {
    return ResultAsync.combine([
      this.channel
        ? ResultAsync.fromPromise(
            this.channel.close(),
            (error) => new QueueError(`Failed to close channel: ${error}`)
          )
        : okAsync(undefined),
      this.connection
        ? ResultAsync.fromPromise(
            this.connection.close(),
            (error) => new QueueError(`Failed to close connection: ${error}`)
          )
        : okAsync(undefined),
    ]).map(() => {
      this.logger.info('Successfully closed RabbitMQ connection and channel');
      this.channel = null;
      this.connection = null;
    });
  }
  consume(
    callback: (result: Result<Notification, QueueError>) => void
  ): ResultAsync<void, QueueError> {
    if (!this.channel) {
      return errAsync(new QueueError('Channel is not initialized'));
    }

    return ResultAsync.fromPromise(
      this.channel.prefetch(1),
      (error) => new QueueError(`Failed to set prefetch: ${error}`)
    )
      .andThen(() =>
        ResultAsync.fromPromise(
          this.channel!.consume(this.config.notificationQueue.queueName, async (message) => {
            if (message) {
              try {
                const notification = JSON.parse(message.content.toString()) as Notification;
                callback(ok(notification));
                this.channel!.ack(message);
              } catch (error) {
                this.channel!.nack(message, false, false);
                callback(err(new QueueError(`Failed to process message: ${error}`)));
              }
            }
          }),
          (error) => new QueueError(`Failed to start consuming: ${error}`)
        )
      )
      .map(() => {
        this.logger.info('Started consuming messages from RabbitMQ');
      });
  }
}
