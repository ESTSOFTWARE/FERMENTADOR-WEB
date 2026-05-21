import type { ExperimentRepository } from '../../domain/repositories/ExperimentRepository'
import type { RunExperimentRequest, RunExperimentResponse } from '../../domain/models/RunExperiment'
import type { ExperimentResult } from '../../domain/models/Experiment'
import type { Simulation } from '../../domain/models/Simulation'
import type { BestPerGenerationResult } from '../../domain/models/BestPerGeneration'

const BASE_URL = import.meta.env.VITE_AI_API_URL

const HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
}

export class ExperimentRepositoryImpl implements ExperimentRepository {
  async runExperiment(data: RunExperimentRequest): Promise<RunExperimentResponse> {
    const res = await fetch(`${BASE_URL}/run-experiment`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(data),
    })
    return res.json()
  }

  async getExperiment(experimentId: string): Promise<ExperimentResult> {
    const res = await fetch(`${BASE_URL}/experiment/${experimentId}`, { headers: HEADERS })
    return res.json()
  }

  async getSimulation(individualId: string): Promise<Simulation> {
    const res = await fetch(`${BASE_URL}/simulation/${individualId}`, { headers: HEADERS })
    return res.json()
  }

  async getBestPerGeneration(experimentId: string): Promise<BestPerGenerationResult> {
    const res = await fetch(`${BASE_URL}/experiment/${experimentId}/best-per-generation`, { headers: HEADERS })
    return res.json()
  }
}