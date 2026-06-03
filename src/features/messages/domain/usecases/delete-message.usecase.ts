import type { ChatRepository } from '../repositories/ChatRepository'

export class DeleteMessageUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(messageId: string): Promise<void> { return this.repository.deleteMessage(messageId) }
}
