import type { FermentationRepository } from '../repositories/FermentationRepository'
import type { PredictionResult }       from '../models/PredictionResult'

export class RequestPredictionUseCase {
  private readonly repository: FermentationRepository

  constructor(repository: FermentationRepository) {
    this.repository = repository
  }

  execute(sessionId: number): Promise<PredictionResult> {
    return this.repository.requestPrediction(sessionId)
  }
}
