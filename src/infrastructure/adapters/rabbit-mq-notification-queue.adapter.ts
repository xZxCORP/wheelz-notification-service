import * as amqp from 'amqplib';
import { Effect } from 'effect';

import { QueueConnectionFailedError } from '../../application/errors/application.error.js';
import { Logger } from '../../application/ports/logger.port.js';
import { NotificationQueue } from '../../application/ports/notification-queue.port.js';
import { QueueConfig } from '../config/queue.config.js';

export class RabbitMQAdapter implements NotificationQueue {
  constructor(
    private readonly logger: Logger,
    private readonly config: QueueConfig
  ) {}

  private createConnection = Effect.acquireRelease(
    Effect.tryPromise(() => amqp.connect(this.config.url)).pipe(
      Effect.tapError((error) => this.logger.error(`Failed to connect to RabbitMQ: ${error}`)),
      Effect.mapError(
        (error) =>
          new QueueConnectionFailedError({
            queueName: this.config.name,
            reason: `Failed to connect to RabbitMQ: ${error}`,
          })
      )
    ),
    (connection) =>
      Effect.gen(this, function* () {
        yield* this.logger.info('Closing RabbitMQ connection');
        yield* Effect.promise(() => connection.close()).pipe(
          Effect.tapError((error) =>
            this.logger.error(`Error closing RabbitMQ connection: ${error}`)
          ),
          Effect.ignore
        );
        yield* this.logger.info('RabbitMQ connection closed successfully');
      })
  );

  private createChannel = (connection: amqp.Connection) =>
    Effect.acquireRelease(
      Effect.tryPromise(() => connection.createChannel()).pipe(
        Effect.tapError((error) => this.logger.error(`Failed to create channel: ${error}`)),
        Effect.mapError(
          (error) =>
            new QueueConnectionFailedError({
              queueName: this.config.name,
              reason: `Failed to create channel: ${error}`,
            })
        )
      ),
      (channel) =>
        Effect.gen(this, function* () {
          yield* this.logger.info('Closing RabbitMQ channel');
          yield* Effect.promise(() => channel.close()).pipe(
            Effect.tapError((error) => this.logger.error(`Error closing channel: ${error}`)),
            Effect.ignore
          );
          yield* this.logger.info('RabbitMQ channel closed successfully');
        })
    );

  private assertQueue = (channel: amqp.Channel) =>
    Effect.tryPromise(() => channel.assertQueue(this.config.name)).pipe(
      Effect.tapError((error) => this.logger.error(`Failed to assert queue: ${error}`)),
      Effect.mapError(
        (error) =>
          new QueueConnectionFailedError({
            queueName: this.config.name,
            reason: `Failed to assert queue: ${error}`,
          })
      )
    );

  private setupConsumer = (
    channel: amqp.Channel,
    callback: (data: string) => Effect.Effect<void, never, never>
  ) =>
    Effect.gen(this, function* () {
      yield* this.assertQueue(channel);

      const processMessage = (message: amqp.ConsumeMessage) =>
        Effect.gen(function* () {
          const content = message.content.toString();
          yield* callback(content);
          yield* Effect.sync(() => channel.ack(message));
        }).pipe(
          Effect.catchAll((error) =>
            Effect.gen(this, function* () {
              yield* this.logger.error(`Error processing message: ${error}`);
              yield* Effect.sync(() => channel.nack(message, false, false));
            })
          )
        );

      const consumeResult = yield* Effect.tryPromise(() =>
        channel.consume(this.config.name, (message) => {
          if (message) {
            Effect.runPromise(processMessage(message));
          }
        })
      ).pipe(
        Effect.mapError(
          (error) =>
            new QueueConnectionFailedError({
              queueName: this.config.name,
              reason: `Failed to start consuming: ${error}`,
            })
        )
      );

      yield* this.logger.info(`Consumer set up with tag: ${consumeResult.consumerTag}`);

      return consumeResult.consumerTag;
    });

  consume(queueName: string, callback: (data: string) => Effect.Effect<void, never, never>) {
    return Effect.gen(this, function* () {
      yield* this.logger.info(`Setting up RabbitMQ consumer for queue: ${queueName}`);

      const connection = yield* this.createConnection;
      const channel = yield* this.createChannel(connection);
      yield* this.setupConsumer(channel, callback);

      yield* Effect.never;
    }).pipe(Effect.scoped);
  }
}
