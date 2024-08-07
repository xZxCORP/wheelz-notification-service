import { Effect, Layer } from 'effect';

import { LoggerService } from '../../application/ports/logger.port.js';
import { MessageEmitterService } from '../../application/ports/message-emitter.port.js';
import { NotificationQueueService } from '../../application/ports/notification-queue.port.js';
import {
  NotificationTransformerService,
  NotificationTransformerServiceImpl,
} from '../../application/services/notification-transformer.service.js';
import {
  ProcessNotificationUseCaseService,
  ProcessNotificationUseCaseServiceImpl,
} from '../../application/uses-cases/process-notification.use-case.js';
import {
  NotificationValidationService,
  NotificationValidationServiceImpl,
} from '../../domain/services/notification-validation.service.js';
import { EffectLoggerAdapter } from '../adapters/effect-logger.adapter.js';
import { EmailMessageEmitterAdapter } from '../adapters/email-message-emitter.adapter.js';
import { RabbitMQAdapter } from '../adapters/rabbit-mq-notification-queue.adapter.js';
import { queueConfig } from '../config/queue.config.js';
//domain
export const NotificationValidationServiceLive = Layer.succeed(
  NotificationValidationService,
  new NotificationValidationServiceImpl()
);

//infrastructure

export const EffectLoggerLive = Layer.succeed(LoggerService, new EffectLoggerAdapter());
export const RabbitMQAdapterLive = Layer.effect(
  NotificationQueueService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const config = yield* queueConfig;
    return new RabbitMQAdapter(logger, config);
  })
).pipe(Layer.provide(EffectLoggerLive));

export const EmailMessageEmitterAdapterLive = Layer.effect(
  MessageEmitterService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    return new EmailMessageEmitterAdapter(logger);
  })
).pipe(Layer.provide(EffectLoggerLive));

//application
export const NotificationTransformerServiceLive = Layer.succeed(
  NotificationTransformerService,
  new NotificationTransformerServiceImpl()
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
  RabbitMQAdapterLive,
  EmailMessageEmitterAdapterLive,
  ProcessNotificationUseCaseLive
);
