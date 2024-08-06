import { Context, Effect } from 'effect';
import { z } from 'zod';

import { Notification, notificationSchema } from '../entities/notification.entity.js';
import {
  InvalidNotificationContentError,
  InvalidRecipientError,
  UnsupportedNotificationTypeError,
} from '../errors/domain.error.js';
export interface NotificationValidation {
  validate(
    notification: string
  ): Effect.Effect<
    Notification,
    InvalidNotificationContentError | InvalidRecipientError | UnsupportedNotificationTypeError,
    never
  >;
}
export class NotificationValidationService extends Context.Tag('NotificationValidation')<
  NotificationValidation,
  NotificationValidation
>() {}
export class NotificationValidationServiceImpl implements NotificationValidation {
  validate(notification: string) {
    return Effect.try({
      try: () => notificationSchema.parse(JSON.parse(notification)),
      catch: (error) => {
        if (error instanceof z.ZodError) {
          const issues = error.issues;
          for (const issue of issues) {
            if (issue.path.includes('content')) {
              return new InvalidNotificationContentError({
                content: notification,
                reason: issue.message,
              });
            }
            if (issue.path.includes('recipient')) {
              return new InvalidRecipientError({
                recipient: String(issue.path),
                reason: issue.message,
              });
            }
            if (issue.path.includes('type')) {
              return new UnsupportedNotificationTypeError({ type: String(issue.path) });
            }
          }
        }
        return new InvalidNotificationContentError({
          content: notification,
          reason: 'Unknown validation error',
        });
      },
    });
  }
}
