import type { FermentationRepository } from '../repositories/FermentationRepository'
import type { ReportHistory }          from '../models/ReportHistory'

export class GetReportHistoryUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(): Promise<ReportHistory[]> {
    return this.repository.getReportHistory()
  }
}
