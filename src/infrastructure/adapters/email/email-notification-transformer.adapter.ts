import { Effect } from 'effect';

import { NotificationTransformer } from '../../../application/ports/notification-transformer.port.js';
import { Message } from '../../../domain/entities/message.entity.js';
import { Notification } from '../../../domain/entities/notification.entity.js';
import { UnsupportedNotificationTypeError } from '../../../domain/errors/domain.error.js';
import { emailTemplate } from './templates/base.template.js';
import { newUserEmailContent } from './templates/new-user.template.js';

export class EmailNotificationTransformerAdapter implements NotificationTransformer {
  transform(notification: Notification) {
    switch (notification.type) {
      case 'new_user': {
        const content = newUserEmailContent(
          notification.newUser.firstName,
          notification.newUser.lastName,
          notification.token
        );
        const htmlBody = emailTemplate(content);

        return Effect.succeed({
          body: htmlBody,
          recipient: notification.newUser.email,
          subject: 'Bienvenue chez WheelZ - Confirmez votre inscription',
        } as Message);
      }

      default: {
        return Effect.fail(new UnsupportedNotificationTypeError({ type: notification.type }));
      }
    }
  }
}
