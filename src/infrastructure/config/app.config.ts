import { Config } from 'effect';

import { MailTransporterConfig, mailTransporterConfig } from './mail-transporter.config.js';
import { QueueConfig, queueConfig } from './queue.config.js';

export class AppConfig {
  constructor(
    readonly queue: QueueConfig,
    readonly mailTransporter: MailTransporterConfig
  ) {}
}

export const appConfig = Config.map(
  Config.all([queueConfig, mailTransporterConfig]),
  ([queue, mailTransporter]) => new AppConfig(queue, mailTransporter)
);
