import { Context, Effect } from 'effect';

import { Message } from '../../domain/entities/message.entity.js';
import { EmissionFailedError } from '../errors/application.error.js';

export interface MessageEmitter {
  emit: (message: Message) => Effect.Effect<void, EmissionFailedError, never>;
}
export class MessageEmitterService extends Context.Tag('MessageEmitter')<
  MessageEmitter,
  MessageEmitter
>() {}
