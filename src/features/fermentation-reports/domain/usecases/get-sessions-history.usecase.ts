import type { FermentationRepository } from '../../../fermentation/domain/repositories/FermentationRepository'
import type { FermentationSession }    from '../../../fermentation/domain/models/FermentationSession'

export class GetSessionsHistoryUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(): Promise<FermentationSession[]> {
    return this.repository.getSessionsHistory()
  }
}
