import { Data } from 'effect';

export class NotificationError extends Data.TaggedError('NotificationError')<{
  message: string;
  notificationId: string;
}> {}
