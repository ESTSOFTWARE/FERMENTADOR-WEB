import type { ChatRepository } from '../repositories/ChatRepository'
import type { Conversation }   from '../models/Conversation'

export class GetConversationsUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(): Promise<Conversation[]> { return this.repository.getConversations() }
}
