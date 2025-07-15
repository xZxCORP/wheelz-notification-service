import type { Result } from 'neverthrow';

import type { ValidationError } from '../errors/domain.error.js';

export interface Schema<T> {
  parse(data: unknown): Result<T, ValidationError>;
}
