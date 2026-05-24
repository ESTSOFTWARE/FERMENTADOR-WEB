import type { SensorToggleState } from '../models/SensorToggleState'

export const ALL_SENSORS_OFF: SensorToggleState = {
  temperature: false, alcohol: false, conductivity: false,
  ph: false, turbidity: false, rpm: false, pump: false,
}

export const ALL_SENSORS_ON: SensorToggleState = {
  temperature: true, alcohol: true, conductivity: true,
  ph: true, turbidity: true, rpm: true, pump: true,
}
