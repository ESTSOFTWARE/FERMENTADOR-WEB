import type { BackendSensorType }     from '../../domain/models/BackendSensorType'
import type { SensorReading }         from '../../domain/models/SensorReading'
import type { SensorHistoryResponse } from '../../domain/dtos/response/sensor-history.response'
import { authHeaders, handleResponse } from '../../../../core/api/http'

const BASE_URL = import.meta.env.VITE_API_URL
const WS_URL   = import.meta.env.VITE_WS_URL ?? BASE_URL?.replace(/^http/, 'ws')

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
    return fetch(`${BASE_URL}/sensors/${circuitId}/${sensorType}/history${query}`, {
      headers: authHeaders(),
    }).then(handleResponse<SensorHistoryResponse>)
  },

  getLatest: (
    circuitId:  number,
    sensorType: BackendSensorType,
  ): Promise<SensorReading | null> =>
    fetch(`${BASE_URL}/sensors/${circuitId}/${sensorType}/latest`, {
      headers: authHeaders(),
    }).then(handleResponse<SensorReading | null>),

  toggleSensor: async (
    circuitId:  number,
    sensorType: BackendSensorType,
    active:     boolean,
  ): Promise<void> => {
    await fetch(`${BASE_URL}/circuits/${circuitId}/sensors/${sensorType}/toggle`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ active }),
    }).then(res => {
      if (!res.ok) throw new Error(`Error al ${active ? 'activar' : 'desactivar'} ${sensorType}`)
    })
  },
}

export const createSensorWebSocket = (circuitId: number): WebSocket =>
  new WebSocket(`${WS_URL}/ws/sensors/${circuitId}`)
