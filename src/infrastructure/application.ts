import type { Result } from 'neverthrow';
import { okAsync, ResultAsync } from 'neverthrow';

import { NotificationService } from '../application/services/notification.service.js';
import { NotificationProcessorService } from '../application/services/notification-processor.service.js';
import type { Config } from '../domain/entities/config.entity.js';
import type { AppError } from '../domain/errors/app.error.js';
import type { LoggerPort } from '../domain/ports/logger.port.js';
import type { ProcessNotificationUseCase } from '../domain/use-cases/process-notification.use-case.js';
import { EnvironmentConfigLoader } from './adapters/config/environment.config-loader.js';
import { PinoLogger } from './adapters/logger/pino.logger.js';
import { EmailMessageEmitter } from './adapters/message-emitter/email/email.message-emitter.js';
import { EmailNotificationTransformer } from './adapters/message-emitter/email/email.notification-transformer.js';
import { RabbitMQNotificationQueue } from './adapters/notification-queue/rabbit-mq/rabbit-mq.notification-queue.js';
import { ZodValidator } from './adapters/validation/zod/zod.validator.js';
import { configSchema } from './adapters/validation/zod/zod-config.schema.js';
import { messageSchema } from './adapters/validation/zod/zod-message.schema.js';
import { notificationSchema } from './adapters/validation/zod/zod-notification.schema.js';
import type { ManagedResource } from './managed.resource.js';

export class Application {
  private managedResources: ManagedResource[] = [];
  private notificationQueue: RabbitMQNotificationQueue;
  private notificationProcessor: ProcessNotificationUseCase;
  private notificationService: NotificationService;

  constructor(
    private readonly config: Config,
    private readonly logger: LoggerPort
  ) {
    this.notificationQueue = new RabbitMQNotificationQueue(this.config, this.logger);

    const emailMessageEmitter = new EmailMessageEmitter(this.config, this.logger);
    const emailTransformer = new EmailNotificationTransformer();
    this.notificationProcessor = new NotificationProcessorService(
      emailMessageEmitter,
      new ZodValidator(),
      notificationSchema,
      emailTransformer,
      messageSchema,
      logger
    );
    this.notificationService = new NotificationService(
      this.notificationQueue,
      this.notificationProcessor
    );

    this.managedResources.push(this.notificationQueue, emailMessageEmitter);
  }
  static create(): Result<Application, AppError> {
    const configLoader = new EnvironmentConfigLoader(configSchema, new ZodValidator());
    return configLoader.load().map((config) => {
      const logger = new PinoLogger(config.logLevel);
      return new Application(config, logger);
    });
  }

  initialize(): ResultAsync<void, AppError> {
    this.logger.info('Initializing application');
    return ResultAsync.combine(this.managedResources.map((resource) => resource.initialize())).map(
      () => undefined
    );
  }
  start(): ResultAsync<void, AppError> {
    this.logger.info('Starting application');
    return this.initialize()
      .andThen(() => this.notificationService.start())
      .map(() => {
        this.logger.info('Application started');
      });
  }
  stop(): ResultAsync<void, AppError> {
    this.logger.info('Stopping application');
    for (const resource of this.managedResources.reverse()) {
      resource.dispose();
    }
    return okAsync(undefined);
  }
}
