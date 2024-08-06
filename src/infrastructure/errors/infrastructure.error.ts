import { Data } from 'effect';

export class QueueConnectionFailedError extends Data.TaggedError('QueueConnectionFailed')<{
  queueName: string;
  reason: string;
}> {}

export class MessageDeserializationFailedError extends Data.TaggedError(
  'MessageDeserializationFailed'
)<{
  rawMessage: string;
  reason: string;
}> {}

export type InfrastructureError = QueueConnectionFailedError | MessageDeserializationFailedError;
