import type { Message } from '../models/Message'

export interface ChatRepository {
  sendMessage(history: Message[], userText: string): Promise<string>
}
