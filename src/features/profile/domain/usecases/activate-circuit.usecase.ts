import type { ProfileRepository }     from '../repositories/ProfileRepository'
import type { ActivateCircuitRequest } from '../dtos/request/activate-circuit.request'

export class ActivateCircuitUseCase {
  private readonly repository: ProfileRepository

  constructor(repository: ProfileRepository) {
    this.repository = repository
  }

  async execute(data: ActivateCircuitRequest): Promise<number> {
    const result = await this.repository.activateCircuit(data)

    localStorage.setItem('access_token', result.access_token)
    const stored = localStorage.getItem('user_data')
    if (stored) {
      localStorage.setItem('user_data', JSON.stringify({ ...JSON.parse(stored), circuit_id: result.circuit_id }))
    }

    return result.circuit_id
  }
}
