import { z } from 'zod';

const messageSchema = z.object({
  body: z.string(),
  subject: z.string(),
  recipient: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
