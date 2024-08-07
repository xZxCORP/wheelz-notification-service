import { Context, Effect } from 'effect';

import { Message } from '../../domain/entities/message.entity.js';
import { Notification } from '../../domain/entities/notification.entity.js';
import { UnsupportedNotificationTypeError } from '../../domain/errors/domain.error.js';

export interface NotificationTransformer {
  transform(
    notification: Notification
  ): Effect.Effect<Message, UnsupportedNotificationTypeError, never>;
}
export class NotificationTransformerService extends Context.Tag('NotificationTransformer')<
  NotificationTransformer,
  NotificationTransformer
>() {}
export class NotificationTransformerServiceImpl implements NotificationTransformer {
  transform(notification: Notification) {
    switch (notification.type) {
      case 'new_user': {
        return Effect.succeed({
          body: `Bonjour ${notification.newUser.firstName} ${notification.newUser.lastName},
Merci de vous être inscrit chez WheelZ!

Pour finaliser votre inscription et activer votre compte, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :
<a href="https://wheelz-front.zcorp.ovh/verify?token=${notification.token}">Lien</a>

Si vous n'avez pas créé de compte chez WheelZ, vous pouvez ignorer cet email.

Merci,

L'équipe WheelZ`,
          recipient: notification.newUser.email,
          subject: "Wheelz - Confirmation d'inscription",
        } as Message);
      }

      default: {
        return Effect.fail(new UnsupportedNotificationTypeError({ type: notification.type }));
      }
    }
  }
}
