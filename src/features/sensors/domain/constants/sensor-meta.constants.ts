import type { SensorMeta } from '../models/SensorMeta'

export const SENSOR_META: SensorMeta[] = [
  { key: 'temperature',  label: 'Temperatura',   unit: '°C',    color: '#F59E0B', description: 'Sensor térmico'         },
  { key: 'alcohol',      label: 'Alcohol',        unit: '%v/v',  color: '#22C55E', description: 'Concentración etanol'   },
  { key: 'conductivity', label: 'Conductividad',  unit: 'mS/cm', color: '#3B82F6', description: 'Conductividad iónica'   },
  { key: 'turbidity',    label: 'Turbidez',       unit: 'NTU',   color: '#A78BFA', description: 'Densidad óptica'        },
  { key: 'rpm',          label: 'Motor RPM',      unit: 'rpm',   color: '#06B6D4', description: 'Velocidad de agitación' },
]
