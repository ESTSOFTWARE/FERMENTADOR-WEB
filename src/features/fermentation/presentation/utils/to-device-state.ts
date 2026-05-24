import { SENSOR_KEY_TO_COMMAND, type DeviceState } from '../../../sensors/data/api/commandsWebSocket'
import type { SensorKey }         from '../../../sensors/domain/models/SensorKey'
import type { SensorToggleState } from '../../../sensors/domain/models/SensorToggleState'

export const toDeviceState = (states: SensorToggleState): Partial<DeviceState> => {
  const result: Partial<DeviceState> = {}
  ;(Object.keys(states) as SensorKey[]).forEach(key => {
    const cmdKey = SENSOR_KEY_TO_COMMAND[key]
    if (cmdKey) {
      result[cmdKey] = states[key] ? 'encendido' : 'apagado'
    }
  })
  return result
}
