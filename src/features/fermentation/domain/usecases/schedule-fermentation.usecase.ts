import type { FermentationRepository }      from '../repositories/FermentationRepository'
import type { ScheduleFermentationRequest } from '../dtos/request/schedule-fermentation.request'
import type { FermentationSession }         from '../models/FermentationSession'

export class ScheduleFermentationUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(data: ScheduleFermentationRequest): Promise<FermentationSession> {
    return this.repository.scheduleFermentation(data)
  }
}
