import type { ChatRepository }     from '../repositories/ChatRepository'
import type { SetPriorityRequest } from '../dtos/request/set-priority.request'

export class SetPriorityUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(messageId: string, data: SetPriorityRequest): Promise<void> { return this.repository.setPriority(messageId, data) }
}
