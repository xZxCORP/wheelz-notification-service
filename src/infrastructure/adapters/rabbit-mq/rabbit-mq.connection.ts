import amqp from 'amqplib';
import { Context, Effect } from 'effect';

import { QueueConnectionFailedError } from '../../../application/errors/application.error.js';
import { Logger } from '../../../application/ports/logger.port.js';
import { QueueConfig } from '../../config/queue.config.js';

export class RabbitMQConnectionService extends Context.Tag('RabbitMQConnection')<
  RabbitMQConnectionService,
  amqp.Connection
>() {}

export const createRabbitMQConnection = (config: QueueConfig, logger: Logger) =>
  Effect.acquireRelease(
    Effect.gen(function* () {
      yield* logger.info('Creating RabbitMQ connection');
      const connection = yield* Effect.tryPromise(() => amqp.connect(config.url));
      yield* logger.info('RabbitMQ connection created successfully');
      return connection;
    }).pipe(
      Effect.mapError((error) => {
        const errorMessage = error instanceof Error ? error.cause : String(error);
        return new QueueConnectionFailedError({
          reason: `Failed to create RabbitMQ Connection: ${errorMessage}`,
        });
      })
    ),
    (connection) =>
      Effect.promise(() => connection.close()).pipe(
        Effect.tap(() => logger.info('RabbitMQ connection closed successfully')),
        Effect.tapError((error) => logger.error(`Error closing RabbitMQ connection: ${error}`)),
        Effect.ignore
      )
  );
