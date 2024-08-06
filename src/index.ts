import * as dotenv from 'dotenv';
import { Effect } from 'effect';

import { LoggerService } from './application/ports/logger.port.js';
import { NotificationQueueService } from './application/ports/notification-queue.port.js';
import { ProcessNotificationUseCaseService } from './application/uses-cases/process-notification.use-case.js';
import { appConfig } from './infrastructure/config/app.config.js';
import { MainLive } from './infrastructure/layers/app.layer.js';

dotenv.config();

const program = Effect.gen(function* () {
  const logger = yield* LoggerService;
  const queue = yield* NotificationQueueService;
  const processNotificationUseCase = yield* ProcessNotificationUseCaseService;
  const config = yield* appConfig;
  yield* logger.info('Starting notification processing');

  yield* queue.consume(config.queue.name, (data) => processNotificationUseCase.execute(data));
});
const runnable = Effect.provide(program, MainLive);

Effect.runPromise(runnable);
