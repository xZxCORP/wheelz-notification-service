import z from 'zod';

import { Config } from '../../../../domain/entities/config.entity.js';
import { createZodSchema } from './zod.validator.js';
const configZodSchema = z.object({
  logLevel: z.string(),
  notificationQueue: z.object({
    url: z.string(),
    queueName: z.string(),
  }),
  messageEmitter: z.object({
    host: z.string(),
    port: z.number(),
    auth: z.object({
      username: z.string(),
      password: z.string(),
    }),
  }),
});

export const configSchema = createZodSchema<Config>(configZodSchema);
