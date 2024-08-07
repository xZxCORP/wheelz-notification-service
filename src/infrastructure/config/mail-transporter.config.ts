import { Config, Redacted } from 'effect';

export class MailTransporterConfig {
  constructor(
    readonly host: string,
    readonly port: number,
    readonly username: string,
    readonly password: Redacted.Redacted<string>
  ) {}
}

export const mailTransporterConfig = Config.map(
  Config.all([
    Config.string('SMTP_HOST'),
    Config.number('SMTP_PORT'),
    Config.string('SMTP_USERNAME'),
    Config.redacted('SMTP_PASSWORD'),
  ]),
  ([host, port, username, password]) => new MailTransporterConfig(host, port, username, password)
);
