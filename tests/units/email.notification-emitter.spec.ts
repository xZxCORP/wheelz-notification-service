import assert from 'node:assert'
import { describe, it } from 'node:test'

import { Notification } from '../../src/domain/notification.js'
import { EmailNotificationEmitter } from '../../src/infrastructure/email.notification-emitter.js'
import { MockLogger } from '../mocks/mock.logger.js'

describe('EmailNotificationEmitter', async () => {
  it('emit should log the notification correctly', async () => {
    const mockLogger = new MockLogger()
    const emitter = new EmailNotificationEmitter(mockLogger)
    const notification: Notification = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      recipient: 'test@example.com',
      content: 'Test notification',
    }

    await emitter.emit(notification)

    const lastLog = mockLogger.getLastLog()
    assert.strictEqual(lastLog?.level, 'info')
    assert.strictEqual(lastLog?.message, 'Emit notification with email')
    assert.deepStrictEqual(lastLog?.optionalParameters[0], notification)
  })

  it('emit should resolve the promise', async () => {
    const mockLogger = new MockLogger()
    const emitter = new EmailNotificationEmitter(mockLogger)
    const notification: Notification = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      recipient: 'test@example.com',
      content: 'Test notification',
    }

    await assert.doesNotReject(emitter.emit(notification))
  })
})
