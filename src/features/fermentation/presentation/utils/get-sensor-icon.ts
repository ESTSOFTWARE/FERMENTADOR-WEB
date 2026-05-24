import { SENSOR_ICONS, FALLBACK_ICON } from '../constants/sensor-icons.constants'

export const getSensorIcon = (key: string): string =>
  SENSOR_ICONS[key] ?? FALLBACK_ICON
