import z from 'zod';

import type { Message } from '../../../../domain/entities/message.entity.js';
import { createZodSchema } from './zod.validator.js';
const messageZodSchema = z.object({
  recipient: z.string(),
  subject: z.string(),
  body: z.string(),
});

export const messageSchema = createZodSchema<Message>(messageZodSchema);
