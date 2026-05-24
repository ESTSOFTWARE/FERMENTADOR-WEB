import type { ChatRepository } from '../repositories/ChatRepository'
import type { Message }        from '../models/Message'

export class SendMessageUseCase {
  private readonly repository: ChatRepository

  constructor(repository: ChatRepository) {
    this.repository = repository
  }

  execute(history: Message[], userText: string): Promise<string> {
    return this.repository.sendMessage(history, userText)
  }
}
