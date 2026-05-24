import type { BackendSensorType } from './BackendSensorType'

export interface SensorReading {
  id:          number
  circuit_id:  number
  sensor_type: BackendSensorType
  value:       number
  session_id:  number | null
  timestamp:   string
}
