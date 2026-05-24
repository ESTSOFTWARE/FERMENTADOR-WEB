import { useState, useEffect, useRef, useCallback }  from 'react'
import { SensorRepositoryImpl }                      from '../../data/repositories/SensorRepositoryImpl'
import { GetSensorHistoryUseCase }                   from '../../domain/usecases/get-sensor-history.usecase'
import { createSensorWebSocket }                     from '../../data/api/sensorApi'
import { SENSOR_META }                               from '../../domain/constants/sensor-meta.constants'
import { emptyChartData }                            from '../utils/empty-chart-data'
import { formatTime }                                from '../utils/format-time'
import { MAX_CHART_POINTS }                          from '../constants/chart.constants'
import type { BackendSensorType }                    from '../../domain/models/BackendSensorType'
import type { SensorChartData }                      from '../../domain/models/SensorChartData'
import type { ChartPoint }                           from '../../domain/models/ChartPoint'
import type { WSMessage }                            from '../../domain/models/WSMessage'
import type { WsStatus }                             from '../types/ws-status.types'
import type { SensorsViewModelOptions }              from '../types/sensors-viewmodel-options.types'

export type { WsStatus }

const repository      = new SensorRepositoryImpl()
const getSensorHistory = new GetSensorHistoryUseCase(repository)

export const useSensorsViewModel = (options?: SensorsViewModelOptions) => {
  const [circuitId,    setCircuitId]    = useState<number>(options?.autoCircuitId ?? 1)
  const [wsStatus,     setWsStatus]     = useState<WsStatus>('disconnected')
  const [chartData,    setChartData]    = useState<SensorChartData>(emptyChartData())
  const [latestValues, setLatestValues] = useState<Partial<Record<BackendSensorType, number>>>({})
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)

  const appendPoint = useCallback((sensorType: BackendSensorType, value: number, timestamp: string) => {
    const point: ChartPoint = { time: formatTime(timestamp), value }
    setChartData(prev => ({
      ...prev,
      [sensorType]: [...prev[sensorType].slice(-(MAX_CHART_POINTS - 1)), point],
    }))
    setLatestValues(prev => ({ ...prev, [sensorType]: value }))
  }, [])

  const loadHistory = useCallback(async (id: number, sessionId?: number) => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled(
        SENSOR_META.map(s => getSensorHistory.execute(id, s.key, sessionId))
      )
      const next = emptyChartData()
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          const sensorType = SENSOR_META[i].key
          next[sensorType] = result.value.readings.map(r => ({
            time:  formatTime(r.timestamp),
            value: r.value,
          }))
          const last = result.value.readings.at(-1)
          if (last) setLatestValues(prev => ({ ...prev, [sensorType]: last.value }))
        }
      })
      setChartData(next)
    } catch {
      setError('Error al cargar el historial de sensores')
    } finally {
      setLoading(false)
    }
  }, [])

  const connectWs = useCallback((id: number) => {
    if (wsRef.current) wsRef.current.close()
    setWsStatus('connecting')

    const ws = createSensorWebSocket(id)
    wsRef.current = ws

    ws.onopen    = () => setWsStatus('connected')
    ws.onerror   = () => setWsStatus('error')
    ws.onclose   = () => { setWsStatus('disconnected'); wsRef.current = null }
    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: WSMessage = JSON.parse(event.data)
        if (msg.type === 'sensor_data') appendPoint(msg.sensor_type, msg.value, msg.timestamp)
      } catch { /* mensaje malformado */ }
    }
  }, [appendPoint])

  const disconnectWs = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setWsStatus('disconnected')
  }, [])

  const applyCircuit = useCallback((id: number, sessionId?: number) => {
    setCircuitId(id)
    setChartData(emptyChartData())
    setLatestValues({})
    loadHistory(id, sessionId)
    connectWs(id)
  }, [loadHistory, connectWs])

  useEffect(() => {
    const id        = options?.autoCircuitId
    const sessionId = options?.autoSessionId
    if (!id) return
    applyCircuit(id, sessionId)
    return () => { wsRef.current?.close() }
  }, [options?.autoCircuitId, options?.autoSessionId])

  useEffect(() => {
    return () => { wsRef.current?.close() }
  }, [])

  return {
    circuitId, wsStatus, chartData, latestValues, loading, error,
    setCircuitId, applyCircuit, connectWs, disconnectWs, loadHistory,
  }
}
