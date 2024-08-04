import { Data } from 'effect';

export class QueueConnectionError extends Data.TaggedError('QueueConnectionError')<{
  message: string;
  queueUrl: string;
}> {}

export class QueueReceiveError extends Data.TaggedError('QueueReceiveError')<{
  message: string;
  queueName: string;
}> {}
