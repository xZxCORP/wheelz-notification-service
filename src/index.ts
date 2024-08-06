import { Effect, Layer } from 'effect';

import { LoggerService } from './application/ports/logger.port.js';
import {
  NotificationValidationService,
  NotificationValidationServiceImpl,
} from './domain/services/notification-validation.service.js';
import { EffectLoggerAdapter } from './infrastructure/adapters/effect-logger.adapter.js';

const LoggerLive = Layer.succeed(LoggerService, new EffectLoggerAdapter());

const NotificationValidationServiceLive = Layer.succeed(
  NotificationValidationService,
  new NotificationValidationServiceImpl()
);

const AppLive = Layer.merge(LoggerLive, NotificationValidationServiceLive);

const program = Effect.gen(function* () {
  //   const notificationQueue = yield* _(NotificationQueuePort);
  //   const processNotificationUseCase = yield* _(ProcessNotificationUseCase);
  const logger = yield* LoggerService;

  yield* logger.info('Starting notification processing');

  //   yield* _(
  //     notificationQueue.consume('notifications_queue', (notificationData) =>
  //       processNotificationUseCase.execute(notificationData)
  //     )
  //   );
});
const runnable = Effect.provide(program, AppLive);

Effect.runPromise(runnable);
