import { Effect, Layer } from 'effect';

import { LoggerService } from '../../application/ports/logger.port.js';
import { NotificationEmitterService } from '../../application/ports/notification-emitter.port.js';
import { NotificationQueueService } from '../../application/ports/notification-queue.port.js';
import {
  ProcessNotificationUseCaseService,
  ProcessNotificationUseCaseServiceImpl,
} from '../../application/uses-cases/process-notification.use-case.js';
import {
  NotificationValidationService,
  NotificationValidationServiceImpl,
} from '../../domain/services/notification-validation.service.js';
import { EffectLoggerAdapter } from '../adapters/effect-logger.adapter.js';
import { EmailNotificationEmitterAdapter } from '../adapters/email-notification-emitter.adapter.js';
import { RabbitMQAdapter } from '../adapters/rabbit-mq-notification-queue.adapter.js';
import { queueConfig } from '../config/queue.config.js';
export const NotificationValidationServiceLive = Layer.succeed(
  NotificationValidationService,
  new NotificationValidationServiceImpl()
);

export const EffectLoggerLive = Layer.succeed(LoggerService, new EffectLoggerAdapter());
export const RabbitMQAdapterLive = Layer.effect(
  NotificationQueueService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const config = yield* queueConfig;
    return new RabbitMQAdapter(logger, config);
  })
).pipe(Layer.provide(EffectLoggerLive));

export const EmailNotificationEmitterAdapterLive = Layer.effect(
  NotificationEmitterService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    return new EmailNotificationEmitterAdapter(logger);
  })
).pipe(Layer.provide(EffectLoggerLive));

export const ProcessNotificationUseCaseLive = Layer.effect(
  ProcessNotificationUseCaseService,
  Effect.gen(function* () {
    const logger = yield* LoggerService;
    const notificationEmitter = yield* NotificationEmitterService;
    const notificationValidation = yield* NotificationValidationService;
    return new ProcessNotificationUseCaseServiceImpl(
      logger,
      notificationEmitter,
      notificationValidation
    );
  })
).pipe(
  Layer.provide(EffectLoggerLive),
  Layer.provide(EmailNotificationEmitterAdapterLive),
  Layer.provide(NotificationValidationServiceLive)
);

export const MainLive = Layer.mergeAll(
  EffectLoggerLive,
  NotificationValidationServiceLive,
  RabbitMQAdapterLive,
  EmailNotificationEmitterAdapterLive,
  ProcessNotificationUseCaseLive
);
