import { Schema } from '@effect/schema';

export const senderTypeSchema = Schema.Union(Schema.Literal('sms'), Schema.Literal('email'));
export type SenderType = Schema.Schema.Type<typeof senderTypeSchema>;
