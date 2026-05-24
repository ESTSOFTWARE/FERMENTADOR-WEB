import type { BackendSensorType }    from '../models/BackendSensorType'
import type { SensorReading }        from '../models/SensorReading'
import type { SensorHistoryResponse } from '../dtos/response/sensor-history.response'

export interface SensorRepository {
  getHistory(
    circuitId:  number,
    sensorType: BackendSensorType,
    sessionId?: number,
    fromDt?:    string,
    toDt?:      string,
  ): Promise<SensorHistoryResponse>

  getLatest(
    circuitId:  number,
    sensorType: BackendSensorType,
  ): Promise<SensorReading | null>

  toggleSensor(
    circuitId:  number,
    sensorType: BackendSensorType,
    active:     boolean,
  ): Promise<void>
}
