import type { RunExperimentRequest } from '../dtos/request/run-experiment.request'
import type { RunExperimentResponse } from '../dtos/response/run-experiment.response'
import type { ExperimentResult } from '../dtos/response/experiment-result.response'
import type { BestPerGenerationResult } from '../dtos/response/best-per-generation-result.response'
import type { Simulation } from '../models/Simulation'

export interface ExperimentRepository {
  runExperiment(data: RunExperimentRequest): Promise<RunExperimentResponse>
  getExperiment(experimentId: string): Promise<ExperimentResult>
  getSimulation(individualId: string): Promise<Simulation>
  getBestPerGeneration(experimentId: string): Promise<BestPerGenerationResult>
}
