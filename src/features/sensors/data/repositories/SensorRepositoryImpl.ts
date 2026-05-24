import { sensorApi }              from '../api/sensorApi'
import type { SensorRepository }  from '../../domain/repositories/SensorRepository'
import type { BackendSensorType } from '../../domain/models/BackendSensorType'
import type { SensorReading }     from '../../domain/models/SensorReading'
import type { SensorHistoryResponse } from '../../domain/dtos/response/sensor-history.response'

export class SensorRepositoryImpl implements SensorRepository {
  getHistory(circuitId: number, sensorType: BackendSensorType, sessionId?: number, fromDt?: string, toDt?: string): Promise<SensorHistoryResponse> {
    return sensorApi.getHistory(circuitId, sensorType, sessionId, fromDt, toDt)
  }

  getLatest(circuitId: number, sensorType: BackendSensorType): Promise<SensorReading | null> {
    return sensorApi.getLatest(circuitId, sensorType)
  }

  toggleSensor(circuitId: number, sensorType: BackendSensorType, active: boolean): Promise<void> {
    return sensorApi.toggleSensor(circuitId, sensorType, active)
  }
}
