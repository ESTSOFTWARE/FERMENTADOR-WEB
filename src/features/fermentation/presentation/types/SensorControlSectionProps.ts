import type { SensorKey } from '../../domain/models/SensorKey'

export type SensorControlSectionProps = {
  sensorStates: Record<SensorKey, boolean>
  loading:      boolean
  disabled?:    boolean
  onToggle:     (key: SensorKey) => void
}
