export interface AbstractMessageQueue {
  connect(): Promise<void>
  disconnect(): Promise<void>
  consume(queue: string, callback: (message: unknown) => Promise<void>): Promise<void>
}
