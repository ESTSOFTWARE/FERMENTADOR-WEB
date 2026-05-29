import type { BackendSensorType }     from '../../domain/models/BackendSensorType'
import type { SensorReading }         from '../../domain/models/SensorReading'
import type { SensorHistoryResponse } from '../../domain/dtos/response/sensor-history.response'
import { apiClient }                  from '../../../../core/network/client'

const WS_URL = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws')

export const sensorApi = {
  getHistory: (
    circuitId:  number,
    sensorType: BackendSensorType,
    sessionId?: number,
    fromDt?:    string,
    toDt?:      string,
  ): Promise<SensorHistoryResponse> => {
    const params = new URLSearchParams()
    if (sessionId) params.set('session_id', String(sessionId))
    if (fromDt)    params.set('from_dt', fromDt)
    if (toDt)      params.set('to_dt', toDt)
    const query = params.toString() ? `?${params}` : ''
    return apiClient.get<SensorHistoryResponse>(`/sensors/${circuitId}/${sensorType}/history${query}`)
  },

  getLatest: (circuitId: number, sensorType: BackendSensorType) =>
    apiClient.get<SensorReading | null>(`/sensors/${circuitId}/${sensorType}/latest`),

  toggleSensor: (circuitId: number, sensorType: BackendSensorType, active: boolean) =>
    apiClient.post<void>(`/circuits/${circuitId}/sensors/${sensorType}/toggle`, { active }),
}

export const createSensorWebSocket = (circuitId: number): WebSocket =>
  new WebSocket(`${WS_URL}/ws/sensors/${circuitId}`)
