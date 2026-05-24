import type { SensorRepository }  from '../repositories/SensorRepository'
import type { BackendSensorType } from '../models/BackendSensorType'

export class ToggleSensorUseCase {
  private readonly repository: SensorRepository

  constructor(repository: SensorRepository) {
    this.repository = repository
  }

  execute(circuitId: number, sensorType: BackendSensorType, active: boolean): Promise<void> {
    return this.repository.toggleSensor(circuitId, sensorType, active)
  }
}
