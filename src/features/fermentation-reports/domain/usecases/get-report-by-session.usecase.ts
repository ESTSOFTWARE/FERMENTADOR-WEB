import type { FermentationRepository } from '../../../fermentation/domain/repositories/FermentationRepository'
import type { FermentationReport }     from '../../../fermentation/domain/models/FermentationReport'

export class GetReportBySessionUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(sessionId: number): Promise<FermentationReport> {
    return this.repository.getReport(sessionId)
  }
}
