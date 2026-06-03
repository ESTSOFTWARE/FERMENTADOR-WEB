import type { ChatRepository }      from '../repositories/ChatRepository'
import type { SendMessageRequest }  from '../dtos/request/send-message.request'
import type { ChatMessage }         from '../models/ChatMessage'

export class SendMessageUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(conversationId: string, data: SendMessageRequest): Promise<ChatMessage> { return this.repository.sendMessage(conversationId, data) }
}
