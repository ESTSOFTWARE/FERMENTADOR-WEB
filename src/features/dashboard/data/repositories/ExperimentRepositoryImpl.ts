import type { ExperimentRepository } from '../../domain/repositories/ExperimentRepository'
import type { RunExperimentRequest } from '../../domain/dtos/request/run-experiment.request'
import type { RunExperimentResponse } from '../../domain/dtos/response/run-experiment.response'
import type { ExperimentResult } from '../../domain/dtos/response/experiment-result.response'
import type { BestPerGenerationResult } from '../../domain/dtos/response/best-per-generation-result.response'
import type { Simulation } from '../../domain/models/Simulation'
import { experimentApi } from '../api/experimentApi'

export class ExperimentRepositoryImpl implements ExperimentRepository {
  runExperiment(data: RunExperimentRequest): Promise<RunExperimentResponse> {
    return experimentApi.runExperiment(data)
  }

  getExperiment(experimentId: string): Promise<ExperimentResult> {
    return experimentApi.getExperiment(experimentId)
  }

  getSimulation(individualId: string): Promise<Simulation> {
    return experimentApi.getSimulation(individualId)
  }

  getBestPerGeneration(experimentId: string): Promise<BestPerGenerationResult> {
    return experimentApi.getBestPerGeneration(experimentId)
  }
}
