import { Context, Effect, Redacted } from 'effect';
import nodemailer from 'nodemailer';

import { EmitterConnectionFailedError } from '../../../application/errors/application.error.js';
import { Logger } from '../../../application/ports/logger.port.js';
import { MailTransporterConfig } from '../../config/mail-transporter.config.js';

export class EmailTransporterService extends Context.Tag('EmailTransporter')<
  EmailTransporterService,
  nodemailer.Transporter
>() {}

export const createEmailTransporter = (config: MailTransporterConfig, logger: Logger) =>
  Effect.acquireRelease(
    Effect.gen(function* () {
      yield* logger.info('Creating Nodemailer transporter');

      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true,
        auth: {
          user: config.username,
          pass: Redacted.value(config.password),
        },
      });

      yield* Effect.tryPromise(() => transporter.verify());

      yield* logger.info('Nodemailer transporter created and verified');

      return transporter;
    }).pipe(
      Effect.mapError(
        () =>
          new EmitterConnectionFailedError({
            reason: 'Failed to create nodemailer transporter',
          })
      )
    ),
    (transporter) =>
      Effect.sync(() => transporter.close()).pipe(
        Effect.tap(() => logger.info('Nodemailer connection closed successfully')),
        Effect.tapError((error) => logger.error(`Error closing nodemailer connection: ${error}`)),
        Effect.mapError(
          () =>
            new EmitterConnectionFailedError({
              reason: `Failed to close Nodemailer connection:`,
            })
        ),
        Effect.ignore
      )
  );
