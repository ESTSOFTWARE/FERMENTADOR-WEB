import type { ChatRepository } from '../repositories/ChatRepository'

export class PinMessageUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(messageId: string): Promise<boolean> { return this.repository.pinMessage(messageId) }
}
