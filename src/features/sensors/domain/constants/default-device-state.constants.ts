import type { DeviceState } from '../models/DeviceState'

export const DEFAULT_STATE: DeviceState = {
  motor:                'apagado',
  bomba:                'apagado',
  sensor_temperatura:   'apagado',
  sensor_ph:            'apagado',
  sensor_alcohol:       'apagado',
  sensor_conductividad: 'apagado',
  sensor_turbidez:      'apagado',
}
