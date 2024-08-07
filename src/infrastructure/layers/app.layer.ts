import { Effect, Layer } from 'effect';

import { LoggerService } from '../../application/ports/logger.port.js';
import { MessageEmitterService } from '../../application/ports/message-emitter.port.js';
import { NotificationQueueService } from '../../application/ports/notification-queue.port.js';
import { NotificationTransformerService } from '../../application/ports/notification-transformer.port.js';
import {
  ProcessNotificationUseCaseService,
  ProcessNotificationUseCaseServiceImpl,
} from '../../application/uses-cases/process-notification.use-case.js';
import {
  NotificationValidationService,
  NotificationValidationServiceImpl,
} from '../../domain/services/notification-validation.service.js';
import { EffectLoggerAdapter } from '../adapters/effect-logger.adapter.js';
import {
  createEmailTransporter,
  EmailTransporterService,
} from '../adapters/email/email.transporter.js';
import { EmailMessageEmitterAdapter } from '../adapters/email/email-message-emitter.adapter.js';
import { EmailNotificationTransformerAdapter } from '../adapters/email/email-notification-transformer.adapter.js';
import {
  createRabbitMQChannel,
  RabbitMQChannelService,
} from '../adapters/rabbit-mq/rabbit-mq.channel.js';
import {
  createRabbitMQConnection,
  RabbitMQConnectionService,
} from '../adapters/rabbit-mq/rabbit-mq.connection.js';
import { RabbitMQAdapter } from '../adapters/rabbit-mq/rabbit-mq-notification-queue.adapter.js';
import { mailTransporterConfig } from '../config/mail-transporter.config.js';
import { queueConfig } from '../config/queue.config.js';
//domain
export const NotificationValidationServiceLive = Layer.succeed(
  NotificationValidationService,
  new NotificationValidationServiceImpl()
);

//infrastructure

export const EffectLoggerLive = Layer.succeed(LoggerService, new EffectLoggerAdapter());
const RabbitMQConnectionLive = Layer.scoped(
  RabbitMQConnectionService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const config = yield* queueConfig;
    return yield* createRabbitMQConnection(config, logger);
  })
).pipe(Layer.provide(EffectLoggerLive));
const RabbitMQChannelLive = Layer.scoped(
  RabbitMQChannelService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const connection = yield* RabbitMQConnectionService;
    return yield* createRabbitMQChannel(connection, logger);
  })
).pipe(Layer.provide(EffectLoggerLive), Layer.provide(RabbitMQConnectionLive));
export const RabbitMQAdapterLive = Layer.effect(
  NotificationQueueService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const config = yield* queueConfig;
    const channel = yield* RabbitMQChannelService;
    return new RabbitMQAdapter(logger, config, channel);
  })
).pipe(Layer.provide(EffectLoggerLive), Layer.provide(RabbitMQChannelLive));

const EmailTransporterLive = Layer.scoped(
  EmailTransporterService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const config = yield* mailTransporterConfig;
    return yield* createEmailTransporter(config, logger);
  })
).pipe(Layer.provide(EffectLoggerLive));

export const EmailMessageEmitterAdapterLive = Layer.effect(
  MessageEmitterService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const transporter = yield* EmailTransporterService;

    return new EmailMessageEmitterAdapter(logger, transporter);
  })
).pipe(Layer.provide(EffectLoggerLive), Layer.provide(EmailTransporterLive));

//application
export const NotificationTransformerServiceLive = Layer.succeed(
  NotificationTransformerService,
  new EmailNotificationTransformerAdapter()
);
export const ProcessNotificationUseCaseLive = Layer.effect(
  ProcessNotificationUseCaseService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const messageEmitter = yield* MessageEmitterService;
    const notificationValidation = yield* NotificationValidationService;
    const notificationTransformer = yield* NotificationTransformerService;
    return new ProcessNotificationUseCaseServiceImpl(
      logger,
      messageEmitter,
      notificationValidation,
      notificationTransformer
    );
  })
).pipe(
  Layer.provide(EffectLoggerLive),
  Layer.provide(EmailMessageEmitterAdapterLive),
  Layer.provide(NotificationValidationServiceLive),
  Layer.provide(NotificationTransformerServiceLive)
);

export const MainLive = Layer.mergeAll(
  EffectLoggerLive,
  NotificationValidationServiceLive,
  EmailMessageEmitterAdapterLive,
  RabbitMQAdapterLive,
  ProcessNotificationUseCaseLive
);
