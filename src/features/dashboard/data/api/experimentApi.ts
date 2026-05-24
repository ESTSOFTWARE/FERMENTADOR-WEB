import type { RunExperimentRequest } from '../../domain/dtos/request/run-experiment.request'
import type { RunExperimentResponse } from '../../domain/dtos/response/run-experiment.response'
import type { ExperimentResult } from '../../domain/dtos/response/experiment-result.response'
import type { BestPerGenerationResult } from '../../domain/dtos/response/best-per-generation-result.response'
import type { Simulation } from '../../domain/models/Simulation'

const BASE_URL = import.meta.env.VITE_AI_API_URL

const HEADERS = {
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
}

export const experimentApi = {
  runExperiment: (data: RunExperimentRequest): Promise<RunExperimentResponse> =>
    fetch(`${BASE_URL}/run-experiment`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify(data),
    }).then(r => r.json()),

  getExperiment: (experimentId: string): Promise<ExperimentResult> =>
    fetch(`${BASE_URL}/experiment/${experimentId}`, { headers: HEADERS }).then(r => r.json()),

  getSimulation: (individualId: string): Promise<Simulation> =>
    fetch(`${BASE_URL}/simulation/${individualId}`, { headers: HEADERS }).then(r => r.json()),

  getBestPerGeneration: (experimentId: string): Promise<BestPerGenerationResult> =>
    fetch(`${BASE_URL}/experiment/${experimentId}/best-per-generation`, { headers: HEADERS }).then(r => r.json()),
}
