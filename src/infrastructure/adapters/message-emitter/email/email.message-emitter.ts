import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import nodemailer from 'nodemailer';

import type { Config } from '../../../../domain/entities/config.entity.js';
import type { Message } from '../../../../domain/entities/message.entity.js';
import type { LoggerPort } from '../../../../domain/ports/logger.port.js';
import type { MessageEmitterPort } from '../../../../domain/ports/message-emitter.port.js';
import { MessageEmitterError } from '../../../errors/infrastructure.error.js';
import type { ManagedResource } from '../../../managed.resource.js';
export class EmailMessageEmitter implements ManagedResource, MessageEmitterPort {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly config: Config,
    private readonly logger: LoggerPort
  ) {}

  initialize(): ResultAsync<void, MessageEmitterError> {
    this.logger.info('Initializing Email Message Emitter');
    try {
      this.transporter = nodemailer.createTransport({
        host: this.config.messageEmitter.host,
        port: this.config.messageEmitter.port,
        auth: {
          user: this.config.messageEmitter.auth.username,
          pass: this.config.messageEmitter.auth.password,
        },
      });

      return ResultAsync.fromPromise(
        this.transporter.verify(),
        (error) => new MessageEmitterError(`Failed to verify email transporter: ${error}`)
      ).map(() => {
        this.logger.info('Email Message Emitter initialized successfully');
      });
    } catch (error) {
      return errAsync(new MessageEmitterError(`Failed to initialize email transporter: ${error}`));
    }
  }

  dispose(): ResultAsync<void, MessageEmitterError> {
    this.logger.info('Disposing Email Message Emitter');
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
    }
    return okAsync(undefined);
  }

  send(message: Message): ResultAsync<void, MessageEmitterError> {
    if (!this.transporter) {
      return errAsync(new MessageEmitterError('Email transporter is not initialized'));
    }

    this.logger.info(`Sending email to ${message.recipient}`);

    return ResultAsync.fromPromise(
      this.transporter.sendMail({
        from: 'Wheelz',
        to: message.recipient,
        subject: message.subject,
        html: message.body,
      }),
      (error) => new MessageEmitterError(`Failed to send email: ${error}`)
    ).map(() => {
      this.logger.info(`Email sent successfully to ${message.recipient}`);
    });
  }
}
