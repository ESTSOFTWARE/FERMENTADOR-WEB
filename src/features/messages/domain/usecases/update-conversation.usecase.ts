import type { ChatRepository }             from '../repositories/ChatRepository'
import type { UpdateConversationRequest }  from '../dtos/request/update-conversation.request'
import type { Conversation }               from '../models/Conversation'

export class UpdateConversationUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(id: string, data: UpdateConversationRequest): Promise<Conversation> { return this.repository.updateConversation(id, data) }
}
