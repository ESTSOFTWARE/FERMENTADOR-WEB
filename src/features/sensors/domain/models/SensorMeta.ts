import type { BackendSensorType } from './BackendSensorType'

export interface SensorMeta {
  key:         BackendSensorType
  label:       string
  unit:        string
  color:       string
  description: string
}
