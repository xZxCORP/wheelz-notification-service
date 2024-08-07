import { Context, Effect } from 'effect';
import { z } from 'zod';

import { Notification, notificationSchema } from '../entities/notification.entity.js';
import {
  DomainError,
  InvalidNotificationContentError,
  NotificationDeserializationFailedError,
  UnsupportedNotificationTypeError,
} from '../errors/domain.error.js';
export interface NotificationValidation {
  validate(notification: string): Effect.Effect<Notification, DomainError, never>;
}
export class NotificationValidationService extends Context.Tag('NotificationValidation')<
  NotificationValidation,
  NotificationValidation
>() {}
export class NotificationValidationServiceImpl implements NotificationValidation {
  validate(notification: string) {
    return Effect.try({
      try: () => {
        const parsedNotification = JSON.parse(notification);
        return notificationSchema.parse(parsedNotification);
      },
      catch: (error) => this.handleValidationError(error, notification),
    });
  }

  private handleValidationError(error: unknown, notification: string): DomainError {
    if (error instanceof z.ZodError) {
      return this.handleZodError(error, notification);
    }
    return new NotificationDeserializationFailedError({
      rawNotification: notification,
    });
  }

  private handleZodError(error: z.ZodError, notification: string): DomainError {
    const issue = error.issues[0];
    if (issue.path.includes('type')) {
      return new UnsupportedNotificationTypeError({
        type: String(issue.path.at(-1)),
      });
    }

    return new InvalidNotificationContentError({
      content: notification,
      reason: issue.message,
    });
  }
}
