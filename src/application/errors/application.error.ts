import { Data } from 'effect';

export class EmissionFailedError extends Data.TaggedError('EmissionFailed')<{
  notificationId: string;
  reason: string;
}> {}

export type ApplicationError = EmissionFailedError;
