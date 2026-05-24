import type { ExperimentRepository }      from '../repositories/ExperimentRepository'
import type { BestPerGenerationResult }   from '../dtos/response/best-per-generation-result.response'

export class GetBestPerGenerationUseCase {
  private readonly repository: ExperimentRepository

  constructor(repository: ExperimentRepository) {
    this.repository = repository
  }

  execute(experimentId: string): Promise<BestPerGenerationResult> {
    return this.repository.getBestPerGeneration(experimentId)
  }
}
