import { SENSOR_META }        from '../../domain/constants/sensor-meta.constants'
import type { BackendSensorType } from '../../domain/models/BackendSensorType'
import type { SensorChartData }   from '../../domain/models/SensorChartData'

export const emptyChartData = (): SensorChartData => {
  const data = {} as Record<BackendSensorType, []>
  SENSOR_META.forEach(s => { data[s.key] = [] })
  return data as SensorChartData
}
