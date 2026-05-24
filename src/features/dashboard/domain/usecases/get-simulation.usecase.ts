import type { ExperimentRepository } from '../repositories/ExperimentRepository'
import type { Simulation }           from '../models/Simulation'

export class GetSimulationUseCase {
  private readonly repository: ExperimentRepository

  constructor(repository: ExperimentRepository) {
    this.repository = repository
  }

  execute(individualId: string): Promise<Simulation> {
    return this.repository.getSimulation(individualId)
  }
}
