import { AppError } from '../../shared/app.error.js';

export class QueueError extends AppError {
  constructor(message: string) {
    super(message, 'QUEUE_ERROR');
  }
}

export class MessageEmitterError extends AppError {
  constructor(message: string) {
    super(message, 'MESSAGE_EMITTER_ERROR');
  }
}
