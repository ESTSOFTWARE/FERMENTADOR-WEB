import type { ExperimentRepository }   from '../repositories/ExperimentRepository'
import type { RunExperimentRequest }   from '../dtos/request/run-experiment.request'
import type { RunExperimentResponse }  from '../dtos/response/run-experiment.response'

export class RunExperimentUseCase {
  private readonly repository: ExperimentRepository

  constructor(repository: ExperimentRepository) {
    this.repository = repository
  }

  execute(data: RunExperimentRequest): Promise<RunExperimentResponse> {
    return this.repository.runExperiment(data)
  }
}
