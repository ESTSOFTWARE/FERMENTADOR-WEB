import type { FermentationRepository } from '../repositories/FermentationRepository'
import type { FermentationSession }    from '../models/FermentationSession'

export class StartFermentationUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(sessionId: number): Promise<FermentationSession> {
    return this.repository.startFermentation(sessionId)
  }
}
