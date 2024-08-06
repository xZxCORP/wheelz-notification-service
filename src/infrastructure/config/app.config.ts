import { Config } from 'effect';

import { RabbitMQConfig, rabbitMqConfig } from './rabbit-mq.config.js';

export class AppConfig {
  constructor(readonly rabbitMq: RabbitMQConfig) {}
}

export const appConfig = Config.map(
  Config.all([rabbitMqConfig]),
  ([rabbitMq]) => new AppConfig(rabbitMq)
);
