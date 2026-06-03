import type { ChatRepository } from '../repositories/ChatRepository'
import type { ChatMember }     from '../models/ChatMember'

export class GetContactsUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(): Promise<ChatMember[]> { return this.repository.getContacts() }
}
