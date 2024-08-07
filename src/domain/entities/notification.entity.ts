import { z } from 'zod';

const baseNotificationSchema = z.object({
  type: z.string(),
});

const newUserNotificationSchema = baseNotificationSchema.extend({
  type: z.literal('new_user'),
  newUser: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  }),
  token: z.string(),
});

export const notificationSchema = z.discriminatedUnion('type', [newUserNotificationSchema]);

export type Notification = z.infer<typeof notificationSchema>;
