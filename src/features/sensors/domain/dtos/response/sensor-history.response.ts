import type { BackendSensorType } from '../../models/BackendSensorType'
import type { SensorReading }     from '../../models/SensorReading'

export interface SensorHistoryResponse {
  circuit_id:  number
  sensor_type: BackendSensorType
  readings:    SensorReading[]
}
