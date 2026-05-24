import type { FermentationRepository }  from '../repositories/FermentationRepository'
import type { StopFermentationRequest } from '../dtos/request/stop-fermentation.request'
import type { FermentationSession }     from '../models/FermentationSession'

export class StopFermentationUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(sessionId: number, data: StopFermentationRequest): Promise<FermentationSession> {
    return this.repository.stopFermentation(sessionId, data)
  }
}
