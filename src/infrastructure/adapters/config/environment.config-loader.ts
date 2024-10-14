import { configDotenv } from 'dotenv';
import type { Result } from 'neverthrow';

import type { Config } from '../../../domain/entities/config.entity.js';
import type { ValidationError } from '../../../domain/errors/domain.error.js';
import type { ConfigLoaderPort } from '../../../domain/ports/config-loader.port.js';
import type { ConfigSchema } from '../../../domain/schemas/config.schema.js';
import type { Validator } from '../../../domain/validation/validator.js';

export class EnvironmentConfigLoader implements ConfigLoaderPort {
  constructor(
    private readonly configSchema: ConfigSchema,
    private validator: Validator
  ) {
    configDotenv();
  }
  load(): Result<Config, ValidationError> {
    const config = {
      logLevel: process.env.LOG_LEVEL,
      notificationQueue: {
        url: process.env.NOTIFICATION_QUEUE_URL,
        queueName: process.env.NOTIFICATION_QUEUE_NAME,
      },
      messageEmitter: {
        host: process.env.MESSAGE_EMITTER_HOST,
        port: process.env.MESSAGE_EMITTER_PORT,
        auth: {
          username: process.env.MESSAGE_EMITTER_USERNAME,
          password: process.env.MESSAGE_EMITTER_PASSWORD,
        },
      },
    };
    return this.validator.validate<Config>(this.configSchema, config);
  }
}
