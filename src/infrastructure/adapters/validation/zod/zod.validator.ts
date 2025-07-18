import type { Result } from 'neverthrow';
import { err, ok } from 'neverthrow';
import type z from 'zod';

import { ValidationError } from '../../../../domain/errors/domain.error.js';
import type { Schema } from '../../../../domain/validation/schema.js';
import type { Validator } from '../../../../domain/validation/validator.js';

export class ZodValidator implements Validator {
  validate<T>(schema: Schema<T>, data: unknown): Result<T, ValidationError> {
    return schema.parse(data);
  }
}

export function createZodSchema<T>(zodSchema: z.ZodType<T>): Schema<T> {
  return {
    parse: (data: unknown): Result<T, ValidationError> => {
      const result = zodSchema.safeParse(data);
      return result.success
        ? ok(result.data)
        : err(new ValidationError(result.error.name, result.error.errors));
    },
  };
}
