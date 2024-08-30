import { AppError } from '../../domain/errors/app.error.js';
export class ManagedResourceError extends AppError {
  constructor(message: string) {
    super(message, 'MANAGED_RESOURCE_ERROR');
  }
}
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
