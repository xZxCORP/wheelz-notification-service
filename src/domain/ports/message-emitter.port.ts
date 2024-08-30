import { ResultAsync } from 'neverthrow';

import { MessageEmitterError } from '../../infrastructure/errors/infrastructure.error.js';
import { Message } from '../entities/message.entity.js';

export interface MessageEmitterPort {
  send(message: Message): ResultAsync<void, MessageEmitterError>;
}
