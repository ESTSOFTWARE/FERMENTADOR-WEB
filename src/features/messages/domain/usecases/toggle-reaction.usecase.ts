import type { ChatRepository }  from '../repositories/ChatRepository'
import type { ReactionRequest } from '../dtos/request/reaction.request'

export class ToggleReactionUseCase {
  private readonly repository: ChatRepository
  constructor(repository: ChatRepository) { this.repository = repository }
  execute(messageId: string, data: ReactionRequest): Promise<Record<string, string[]>> { return this.repository.toggleReaction(messageId, data) }
}
