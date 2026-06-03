import type { ChatRepository } from '../repositories/ChatRepository'
import type { ChatMessage }    from '../models/ChatMessage'

export class GetMessagesUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(conversationId: string): Promise<ChatMessage[]> { return this.repository.getMessages(conversationId) }
}
