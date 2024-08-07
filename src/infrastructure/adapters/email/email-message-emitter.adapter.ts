import { Effect } from 'effect';
import nodemailer from 'nodemailer';

import { EmissionFailedError } from '../../../application/errors/application.error.js';
import { Logger } from '../../../application/ports/logger.port.js';
import { MessageEmitter } from '../../../application/ports/message-emitter.port.js';
import { Message } from '../../../domain/entities/message.entity.js';

export class EmailMessageEmitterAdapter implements MessageEmitter {
  constructor(
    private readonly logger: Logger,
    private readonly transporter: nodemailer.Transporter
  ) {}

  emit(message: Message): Effect.Effect<void, EmissionFailedError, never> {
    return Effect.gen(this, function* () {
      yield* this.logger.info('Emitting email', message);
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"WheelZ" <${this.transporter.options.sender}>`,
        to: message.recipient,
        subject: message.subject,
        html: message.body,
      };
      yield* Effect.tryPromise(() => this.transporter.sendMail(mailOptions));
      yield* this.logger.info('Email sent');
    }).pipe(Effect.mapError(() => new EmissionFailedError({ reason: 'Failed to send email' })));
  }
}
