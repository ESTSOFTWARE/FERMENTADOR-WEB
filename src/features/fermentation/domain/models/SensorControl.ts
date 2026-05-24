import type { SensorKey } from './SensorKey'

export interface SensorControl {
  key:         SensorKey
  label:       string
  description: string
  unit:        string
  color:       string
  isHardware?: boolean
}
