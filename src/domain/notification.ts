import { z } from 'zod'

export const notificationSchema = z.object({
  id: z.string().uuid(),
  recipient: z.string(),
  content: z.string().min(1),
})

export type Notification = z.infer<typeof notificationSchema>
