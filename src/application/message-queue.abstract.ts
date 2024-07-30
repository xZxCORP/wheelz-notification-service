export interface MessageQueue {
  connect(): Promise<void>
  disconnect(): Promise<void>
  consume(queue: string, callback: (message: unknown) => Promise<void>): Promise<void>
}
