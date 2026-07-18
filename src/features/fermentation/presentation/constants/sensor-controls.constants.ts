import type { SensorControl } from '../../domain/models/SensorControl'

export const SENSOR_CONTROLS: SensorControl[] = [
  { key: 'temperature',  label: 'Temperatura',  description: 'Sensor térmico',        unit: '°C',    color: '#F59E0B' },
  { key: 'alcohol',      label: 'Alcohol',       description: 'Concentración etanol',  unit: '%v/v',  color: '#22C55E' },
  { key: 'conductivity', label: 'Conductividad', description: 'Conductividad iónica',  unit: 'mS/cm', color: '#3B82F6' },
  { key: 'turbidity',    label: 'Turbidez',      description: 'Densidad óptica',       unit: 'NTU',   color: '#A78BFA' },
  { key: 'ph',           label: 'pH',            description: 'Acidez / Alcalinidad',  unit: 'pH',    color: '#EC4899' },
]
