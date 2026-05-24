import type { BackendSensorType } from './BackendSensorType'

export interface WSSensorDataMessage {
  type:       'sensor_data'
  circuit_id: number
  sensor_type: BackendSensorType
  value:      number
  session_id: number | null
  timestamp:  string
}
