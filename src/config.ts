import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RABBITMQ_URL: z.string().url(),
  NOTIFICATION_QUEUE: z.string().min(1),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})
const parsedConfig = configSchema.safeParse(process.env)

if (!parsedConfig.success) {
  throw new Error('Invalid configuration')
}

export const config = parsedConfig.data
