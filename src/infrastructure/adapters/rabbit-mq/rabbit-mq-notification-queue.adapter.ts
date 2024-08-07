import * as amqp from 'amqplib';
import { Effect } from 'effect';

import { QueueConnectionFailedError } from '../../../application/errors/application.error.js';
import { Logger } from '../../../application/ports/logger.port.js';
import { NotificationQueue } from '../../../application/ports/notification-queue.port.js';
import { QueueConfig } from '../../config/queue.config.js';

export class RabbitMQAdapter implements NotificationQueue {
  constructor(
    private readonly logger: Logger,
    private readonly config: QueueConfig,
    private channel: amqp.Channel
  ) {}

  private assertQueue = () =>
    Effect.tryPromise(() => this.channel.assertQueue(this.config.name)).pipe(
      Effect.mapError(
        (error) =>
          new QueueConnectionFailedError({
            reason: `Failed to assert queue: ${error}`,
          })
      )
    );

  private setupConsumer = (callback: (data: string) => Effect.Effect<void, never, never>) =>
    Effect.gen(this, function* () {
      yield* this.assertQueue();

      const processMessage = (message: amqp.ConsumeMessage) =>
        Effect.gen(this, function* () {
          const content = message.content.toString();
          yield* callback(content);
          yield* Effect.sync(() => this.channel.ack(message));
        }).pipe(
          Effect.catchAll((error) =>
            Effect.gen(this, function* () {
              yield* this.logger.error(`Error processing message: ${error}`);
              yield* Effect.sync(() => this.channel.nack(message, false, false));
            })
          )
        );

      const consumeResult = yield* Effect.tryPromise(() =>
        this.channel.consume(this.config.name, (message) => {
          if (message) {
            Effect.runPromise(processMessage(message));
          }
        })
      ).pipe(
        Effect.mapError(
          (error) =>
            new QueueConnectionFailedError({
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

      yield* this.setupConsumer(callback);

      yield* Effect.never;
    });
  }
}
