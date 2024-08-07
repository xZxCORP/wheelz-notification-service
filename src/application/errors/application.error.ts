import { Data } from 'effect';
export class QueueConnectionFailedError extends Data.TaggedError('QueueConnectionFailed')<{
  queueName: string;
  reason: string;
}> {}

export class EmissionFailedError extends Data.TaggedError('EmissionFailed')<{
  notificationId: string;
  reason: string;
}> {}

export type ApplicationError = QueueConnectionFailedError | EmissionFailedError;
