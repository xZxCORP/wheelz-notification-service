import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  type: z.enum(['email']),
  recipient: z.string().email(),
  content: z.string().min(1),
});

export type Notification = z.infer<typeof notificationSchema>;
