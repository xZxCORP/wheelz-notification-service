import { Data } from 'effect';

export class InvalidNotificationContentError extends Data.TaggedError(
  'InvalidNotificationContent'
)<{
  content: unknown;
  reason: string;
}> {}

export class InvalidRecipientError extends Data.TaggedError('InvalidRecipient')<{
  recipient: string;
  reason: string;
}> {}

export class UnsupportedNotificationTypeError extends Data.TaggedError(
  'UnsupportedNotificationType'
)<{
  type: string;
}> {}

export type DomainError =
  | InvalidNotificationContentError
  | InvalidRecipientError
  | UnsupportedNotificationTypeError;
