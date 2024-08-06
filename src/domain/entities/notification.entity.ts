import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.string(),
  recipient: z.string().email(),
  content: z.string().min(1),
});

export type Notification = z.infer<typeof notificationSchema>;
