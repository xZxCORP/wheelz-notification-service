import type { Message } from '../entities/message.entity.js';
import type { Schema } from '../validation/schema.js';

export interface MessageSchema extends Schema<Message> {}
