import { Config, Redacted } from 'effect';

export class MailTransporterConfig {
  constructor(
    readonly host: string,
    readonly port: number,
    readonly secure: boolean,
    readonly username: string,
    readonly password: Redacted.Redacted<string>
  ) {}
}

export const mailTransporterConfig = Config.map(
  Config.all([
    Config.string('SMTP_HOST'),
    Config.number('SMTP_PORT'),
    Config.boolean('SMTP_SECURE'),
    Config.string('SMTP_USERNAME'),
    Config.redacted('SMTP_PASSWORD'),
  ]),
  ([host, port, secure, username, password]) =>
    new MailTransporterConfig(host, port, secure, username, password)
);
