import type { ChatRepository } from '../repositories/ChatRepository'

export class MarkReadUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(conversationId: string): Promise<void> { return this.repository.markRead(conversationId) }
}
