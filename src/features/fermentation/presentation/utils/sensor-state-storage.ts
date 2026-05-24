import type { SensorToggleState } from '../../../sensors/domain/models/SensorToggleState'
import { ALL_SENSORS_OFF }        from '../../../sensors/domain/constants/sensor-toggle-defaults.constants'

const LS_PREFIX = 'fermentation_sensor_states_'

const lsKey = (sessionId: number) => `${LS_PREFIX}${sessionId}`

export const loadSensorStates = (sessionId: number): SensorToggleState | null => {
  try {
    const raw = localStorage.getItem(lsKey(sessionId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as SensorToggleState
    return { ...ALL_SENSORS_OFF, ...parsed }
  } catch {
    return null
  }
}

export const saveSensorStates = (sessionId: number, states: SensorToggleState) => {
  try {
    localStorage.setItem(lsKey(sessionId), JSON.stringify(states))
  } catch {
    /* ignore */
  }
}

export const clearSensorStates = (sessionId: number) => {
  try {
    localStorage.removeItem(lsKey(sessionId))
  } catch {
    /* ignore */
  }
}
