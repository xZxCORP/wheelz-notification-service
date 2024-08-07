import { Data } from 'effect';

export class InvalidNotificationContentError extends Data.TaggedError(
  'InvalidNotificationContent'
)<{
  content: unknown;
  reason: string;
}> {}
export class NotificationDeserializationFailedError extends Data.TaggedError(
  'NotificationDeserializationFailed'
)<{
  rawNotification: string;
}> {}
export class UnsupportedNotificationTypeError extends Data.TaggedError(
  'UnsupportedNotificationType'
)<{
  type: string;
}> {}

export type DomainError =
  | InvalidNotificationContentError
  | NotificationDeserializationFailedError
  | UnsupportedNotificationTypeError;
