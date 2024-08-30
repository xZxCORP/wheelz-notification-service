import { okAsync, Result, ResultAsync } from 'neverthrow';

import { Config } from '../domain/entities/config.entity.js';
import { LoggerPort } from '../domain/ports/logger.port.js';
import { AppError } from '../shared/app.error.js';
import { ManagedResource } from '../shared/managed.resource.js';
import { EnvironmentConfigLoader } from './adapters/config/environment.config-loader.js';
import { WinstonLogger } from './adapters/logger/winston.logger.js';
import { ZodValidator } from './adapters/validation/zod/zod.validator.js';
import { configSchema } from './adapters/validation/zod/zod-config.schema.js';

export class Application {
  private managedResources: ManagedResource[] = [];

  constructor(
    private readonly config: Config,
    private readonly logger: LoggerPort
  ) {}
  static create(): Result<Application, AppError> {
    const configLoader = new EnvironmentConfigLoader(configSchema, new ZodValidator());
    return configLoader.load().map((config) => {
      const logger = new WinstonLogger(config.logLevel);
      return new Application(config, logger);
    });
  }

  initialize(): ResultAsync<void, AppError> {
    this.logger.info('Initializing application');
    return okAsync(undefined);
  }
  start(): ResultAsync<void, AppError> {
    this.logger.info('Starting application');
    return this.initialize()
      .map(() => this.logger.info('Application started'))
      .mapErr((error) => {
        this.logger.error(`Failed to start application: ${error.message}`);
        return error;
      });
  }
  stop(): ResultAsync<void, AppError> {
    this.logger.info('Stopping application');
    for (const resource of this.managedResources.reverse()) {
      resource
        .dispose()
        .mapErr((error) => this.logger.error(`Failed to dispose resource: ${error.message}`));
    }
    return okAsync(undefined);
  }
}
