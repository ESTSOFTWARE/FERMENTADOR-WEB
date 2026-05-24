import type { BackendSensorType } from './BackendSensorType'
import type { ChartPoint }        from './ChartPoint'

export type SensorChartData = Record<BackendSensorType, ChartPoint[]>
