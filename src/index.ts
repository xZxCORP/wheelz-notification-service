import * as dotenv from 'dotenv';
import { Effect, Layer } from 'effect';

import { LoggerService } from './application/ports/logger.port.js';
import {
  NotificationValidationService,
  NotificationValidationServiceImpl,
} from './domain/services/notification-validation.service.js';
import { EffectLoggerAdapter } from './infrastructure/adapters/effect-logger.adapter.js';
import { appConfig } from './infrastructure/config/app.config.js';

dotenv.config();
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
  const config = yield* appConfig;

  yield* logger.info('Starting notification processing');
  yield* logger.info(config);

  //   yield* _(
  //     notificationQueue.consume('notifications_queue', (notificationData) =>
  //       processNotificationUseCase.execute(notificationData)
  //     )
  //   );
});
const runnable = Effect.provide(program, AppLive);

Effect.runPromise(runnable);
