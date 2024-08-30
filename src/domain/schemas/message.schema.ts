import { Message } from '../entities/message.entity.js';
import { Schema } from '../validation/schema.js';

export interface MessageSchema extends Schema<Message> {}
