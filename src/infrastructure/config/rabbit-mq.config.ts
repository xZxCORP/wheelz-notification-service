import { Config } from 'effect';

export class RabbitMQConfig {
  constructor(
    readonly url: string,
    readonly queue: string
  ) {}
}

export const rabbitMqConfig = Config.map(
  Config.all([Config.string('RABBITMQ_URL'), Config.string('NOTIFICATION_QUEUE')]),
  ([url, queue]) => new RabbitMQConfig(url, queue)
);
