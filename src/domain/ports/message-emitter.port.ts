import type { ResultAsync } from 'neverthrow';

import type { MessageEmitterError } from '../../infrastructure/errors/infrastructure.error.js';
import type { Message } from '../entities/message.entity.js';

export interface MessageEmitterPort {
  send(message: Message): ResultAsync<void, MessageEmitterError>;
}
