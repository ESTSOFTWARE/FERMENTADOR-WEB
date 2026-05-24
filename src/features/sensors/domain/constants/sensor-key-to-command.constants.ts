import type { DeviceState } from '../models/DeviceState'

export const SENSOR_KEY_TO_COMMAND: Record<string, keyof DeviceState> = {
  temperature:  'sensor_temperatura',
  ph:           'sensor_ph',
  alcohol:      'sensor_alcohol',
  conductivity: 'sensor_conductividad',
  turbidity:    'sensor_turbidez',
  rpm:          'motor',
  pump:         'bomba',
}
