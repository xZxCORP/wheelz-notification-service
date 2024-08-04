import { Schema } from '@effect/schema';

import { senderTypeSchema } from './sender.entity.js';

export const notificationSchema = Schema.Struct({
  id: Schema.String,
  type: senderTypeSchema,
  recipient: Schema.String,
  content: Schema.String,
});

export type Notification = Schema.Schema.Type<typeof notificationSchema>;
