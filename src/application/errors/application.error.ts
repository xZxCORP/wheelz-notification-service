import { Data } from 'effect';

export class QueueConnectionFailedError extends Data.TaggedError('QueueConnectionFailed')<{
  reason: string;
}> {}

export class EmitterConnectionFailedError extends Data.TaggedError('EmitterConnectionFailed')<{
  reason: string;
}> {}

export class EmissionFailedError extends Data.TaggedError('EmissionFailed')<{
  reason: string;
}> {}

export type ApplicationError = QueueConnectionFailedError | EmissionFailedError;
