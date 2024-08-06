import { Config } from 'effect';

export class QueueConfig {
  constructor(
    readonly url: string,
    readonly name: string
  ) {}
}

export const queueConfig = Config.map(
  Config.all([Config.string('QUEUE_URL'), Config.string('QUEUE_NAME')]),
  ([url, name]) => new QueueConfig(url, name)
);
