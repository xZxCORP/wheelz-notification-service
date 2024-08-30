import z from 'zod';

import { Notification } from '../../../../domain/entities/notification.entity.js';
import { createZodSchema } from './zod.validator.js';
const baseNotificationSchema = z.object({
  type: z.string(),
});

const newUserNotificationSchema = baseNotificationSchema.extend({
  type: z.literal('new_user'),
  payload: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    token: z.string(),
  }),
});

export const zodNotificationSchema = z.discriminatedUnion('type', [newUserNotificationSchema]);
export const notificationSchema = createZodSchema<Notification>(zodNotificationSchema);
