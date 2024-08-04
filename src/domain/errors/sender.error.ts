import { Data } from 'effect';

import { SenderType } from '../entities/sender.entity.js';

export class SenderError extends Data.TaggedError('SenderError')<{
  message: string;
  recipient: string;
  type: SenderType;
}> {}
