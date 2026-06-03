import type { ChatRepository } from '../repositories/ChatRepository'

export class LeaveConversationUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(id: string): Promise<void> { return this.repository.leaveConversation(id) }
}
