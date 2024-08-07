import amqp from 'amqplib';
import { Context, Effect } from 'effect';

import { QueueConnectionFailedError } from '../../../application/errors/application.error.js';
import { Logger } from '../../../application/ports/logger.port.js';

export class RabbitMQChannelService extends Context.Tag('RabbitMQChannel')<
  RabbitMQChannelService,
  amqp.Channel
>() {}

export const createRabbitMQChannel = (connection: amqp.Connection, logger: Logger) =>
  Effect.acquireRelease(
    Effect.gen(function* () {
      yield* logger.info('Creating RabbitMQ channel');
      const channel = yield* Effect.tryPromise(() => connection.createChannel());
      yield* logger.info('RabbitMQ channel created successfully');
      return channel;
    }).pipe(
      Effect.mapError(
        () =>
          new QueueConnectionFailedError({
            reason: 'Failed to create RabbitMQ Channel',
          })
      )
    ),
    (channel) =>
      Effect.promise(() => channel.close()).pipe(
        Effect.tap(() => logger.info('RabbitMQ channel closed successfully')),
        Effect.tapError((error) => logger.error(`Error closing Channel connection: ${error}`)),
        Effect.ignore
      )
  );
