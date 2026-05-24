import type { BackendSensorType } from './BackendSensorType'

export interface WSSensorDeactivatedMessage {
  type:           'sensor_deactivated'
  circuit_id:     number
  sensor_type:    BackendSensorType
  session_id:     number
  deactivated_at: string
}
