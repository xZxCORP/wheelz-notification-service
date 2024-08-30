import { err, ok, Result } from 'neverthrow';

import { Message } from '../../../../domain/entities/message.entity.js';
import { NewUserPayload, Notification } from '../../../../domain/entities/notification.entity.js';
import { NotificationTransformerError } from '../../../../domain/errors/domain.error.js';
import { NotificationTransformerPort } from '../../../../domain/ports/notification-transformer.port.js';
import { emailTemplate } from './templates/base.template.js';
import { newUserEmailContent } from './templates/new-user.template.js';

type TransformFunction<T extends object> = (
  notification: T
) => Result<Message, NotificationTransformerError>;

export class EmailNotificationTransformer implements NotificationTransformerPort {
  private transformNewUser: TransformFunction<NewUserPayload> = (payload) => {
    const { firstName, lastName, token, email } = payload;
    const content = newUserEmailContent(firstName, lastName, token);
    const htmlBody = emailTemplate(content);

    return ok({
      body: htmlBody,
      recipient: email,
      subject: 'Bienvenue chez WheelZ - Confirmez votre inscription',
    });
  };
  private transformers: Record<Notification['type'], TransformFunction<any>> = {
    new_user: this.transformNewUser,
  };

  transform(notification: Notification): Result<Message, NotificationTransformerError> {
    const transformer = this.transformers[notification.type];
    if (!transformer) {
      return err(
        new NotificationTransformerError(`Unsupported notification type: ${notification.type}`)
      );
    }
    return transformer(notification);
  }
}
