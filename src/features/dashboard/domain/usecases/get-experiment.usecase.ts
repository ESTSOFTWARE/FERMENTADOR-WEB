import type { ExperimentRepository } from '../repositories/ExperimentRepository'
import type { ExperimentResult }     from '../dtos/response/experiment-result.response'

export class GetExperimentUseCase {
  private readonly repository: ExperimentRepository

  constructor(repository: ExperimentRepository) {
    this.repository = repository
  }

  execute(experimentId: string): Promise<ExperimentResult> {
    return this.repository.getExperiment(experimentId)
  }
}
