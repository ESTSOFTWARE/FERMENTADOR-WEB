import type { FermentationRepository } from '../repositories/FermentationRepository'
import type { FermentationSession }    from '../models/FermentationSession'

export class GetActiveSessionUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(): Promise<FermentationSession | null> {
    return this.repository.getActiveSession()
  }
}
