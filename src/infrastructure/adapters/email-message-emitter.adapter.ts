import { Effect } from 'effect';

import { EmissionFailedError } from '../../application/errors/application.error.js';
import { Logger } from '../../application/ports/logger.port.js';
import { MessageEmitter } from '../../application/ports/message-emitter.port.js';
import { Message } from '../../domain/entities/message.entity.js';
export class EmailMessageEmitterAdapter implements MessageEmitter {
  constructor(private readonly logger: Logger) {}
  emit(message: Message): Effect.Effect<void, EmissionFailedError, never> {
    return Effect.gen(this, function* () {
      yield* this.logger.info('emit email', message);
    });
  }
}
