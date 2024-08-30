import { AppError } from '../../shared/app.error.js';
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
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
