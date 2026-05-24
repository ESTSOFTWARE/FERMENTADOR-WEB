import type { SensorRepository }       from '../repositories/SensorRepository'
import type { BackendSensorType }       from '../models/BackendSensorType'
import type { SensorHistoryResponse }  from '../dtos/response/sensor-history.response'

export class GetSensorHistoryUseCase {
  private readonly repository: SensorRepository

  constructor(repository: SensorRepository) {
    this.repository = repository
  }

  execute(
    circuitId:  number,
    sensorType: BackendSensorType,
    sessionId?: number,
    fromDt?:    string,
    toDt?:      string,
  ): Promise<SensorHistoryResponse> {
    return this.repository.getHistory(circuitId, sensorType, sessionId, fromDt, toDt)
  }
}
