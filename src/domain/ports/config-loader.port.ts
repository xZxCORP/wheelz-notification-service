import type { Result } from 'neverthrow';

import type { Config } from '../entities/config.entity.js';
import type { ValidationError } from '../errors/domain.error.js';

export interface ConfigLoaderPort {
  load(): Result<Config, ValidationError>;
}
