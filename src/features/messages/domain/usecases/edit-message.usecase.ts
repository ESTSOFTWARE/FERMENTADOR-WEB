import type { ChatRepository }      from '../repositories/ChatRepository'
import type { EditMessageRequest }  from '../dtos/request/edit-message.request'
import type { ChatMessage }         from '../models/ChatMessage'

export class EditMessageUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(messageId: string, data: EditMessageRequest): Promise<ChatMessage> { return this.repository.editMessage(messageId, data) }
}
