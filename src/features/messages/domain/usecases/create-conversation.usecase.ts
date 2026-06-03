import type { ChatRepository }             from '../repositories/ChatRepository'
import type { CreateConversationRequest }  from '../dtos/request/create-conversation.request'
import type { Conversation }               from '../models/Conversation'

export class CreateConversationUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(data: CreateConversationRequest): Promise<Conversation> { return this.repository.createConversation(data) }
}
