import type { Result } from 'neverthrow';

import type { ValidationError } from '../errors/domain.error.js';
import type { Schema } from './schema.js';

export interface Validator {
  validate<T>(schema: Schema<T>, data: unknown): Result<T, ValidationError>;
}
