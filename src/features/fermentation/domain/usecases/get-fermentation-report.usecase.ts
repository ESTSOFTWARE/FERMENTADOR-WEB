import type { FermentationRepository } from '../repositories/FermentationRepository'
import type { FermentationReport }     from '../models/FermentationReport'

export class GetFermentationReportUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(sessionId: number): Promise<FermentationReport> {
    return this.repository.getReport(sessionId)
  }
}
