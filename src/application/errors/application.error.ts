import { AppError } from '../../domain/errors/app.error.js';

export class NotificationProcessingError extends AppError {
  constructor(message: string) {
    super(message, 'NOTIFICATION_PROCESSING_ERROR');
  }
}
