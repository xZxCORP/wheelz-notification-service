import { AppError } from './app.error.js';
export class ValidationError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'VALIDATION_ERROR');
    this.cause = cause;
  }
}
export class NotificationTransformerError extends AppError {
  constructor(message: string) {
    super(message, 'NOTIFICATION_TRANSFORMER_ERROR');
  }
}

export class InvalidNotificationError extends AppError {
  constructor(message: string) {
    super(message, 'INVALID_NOTIFICATION');
  }
}

export class InvalidMessageError extends AppError {
  constructor(message: string) {
    super(message, 'INVALID_MESSAGE');
  }
}
