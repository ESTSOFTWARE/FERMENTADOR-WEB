import type { SensorRepository }  from '../repositories/SensorRepository'
import type { BackendSensorType } from '../models/BackendSensorType'
import type { SensorReading }     from '../models/SensorReading'

export class GetLatestSensorUseCase {
  private readonly repository: SensorRepository

  constructor(repository: SensorRepository) {
    this.repository = repository
  }

  execute(circuitId: number, sensorType: BackendSensorType): Promise<SensorReading | null> {
    return this.repository.getLatest(circuitId, sensorType)
  }
}
