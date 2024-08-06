import { Config } from 'effect';

import { QueueConfig, queueConfig } from './queue.config.js';

export class AppConfig {
  constructor(readonly queue: QueueConfig) {}
}

export const appConfig = Config.map(Config.all([queueConfig]), ([queue]) => new AppConfig(queue));
