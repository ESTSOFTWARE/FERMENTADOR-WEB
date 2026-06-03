import type { ChatRepository }     from '../repositories/ChatRepository'
import type { MessageAttachment }  from '../models/MessageAttachment'

export class UploadFileUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(file: File): Promise<MessageAttachment> { return this.repository.uploadFile(file) }
}
