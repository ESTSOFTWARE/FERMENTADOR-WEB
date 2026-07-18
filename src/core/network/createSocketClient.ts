import type { SocketClient, SocketConnectionStatus } from './sockeClient.types.js'

// Misma resolución de base que ya usa el resto del proyecto (VITE_WS_URL o
// derivada de VITE_API_URL). Centralizada aquí — nadie más debe recalcularla.
export const WS_BASE =
  import.meta.env.VITE_WS_URL ??
  import.meta.env.VITE_API_URL?.replace(/^http/, 'ws').replace(/\/api$/, '')

const MAX_RECONNECT_DELAY_MS = 15_000
const BASE_RECONNECT_DELAY_MS = 1_000

/**
 * Fábrica de clientes WebSocket con reconexión automática (backoff exponencial)
 * y cierre limpio. No conoce contratos de negocio: solo transporta strings.
 * Cada feature decide el `path` (segmento tras /ws/) y parsea sus propios mensajes.
 */
// src/core/network/createSocketClient.ts
const CONNECT_TIMEOUT_MS = 8_000

export const createSocketClient = (path: string): SocketClient => {
  let socket: WebSocket | null = null
  let status: SocketConnectionStatus = 'idle'
  let reconnectAttempt = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let connectTimeoutTimer: ReturnType<typeof setTimeout> | null = null
  let closedByClient = false

  const messageListeners = new Set<(raw: string) => void>()
  const statusListeners  = new Set<(status: SocketConnectionStatus) => void>()

  const setStatus = (next: SocketConnectionStatus) => {
    status = next
    statusListeners.forEach(cb => cb(next))
  }

  const clearReconnectTimer = () => {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null }
  }

  const clearConnectTimeoutTimer = () => {
    if (connectTimeoutTimer) { clearTimeout(connectTimeoutTimer); connectTimeoutTimer = null }
  }

  const scheduleReconnect = () => {
    if (closedByClient) return
    setStatus('reconnecting')
    const delay = Math.min(BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempt, MAX_RECONNECT_DELAY_MS)
    reconnectAttempt += 1
    clearReconnectTimer()
    reconnectTimer = setTimeout(() => connect(), delay)
  }

  const connect = () => {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return
    closedByClient = false
    setStatus(reconnectAttempt > 0 ? 'reconnecting' : 'connecting')

    const ws = new WebSocket(`${WS_BASE}/ws/${path}`)
    socket = ws

    // si no abre a tiempo, se fuerza cierre → onclose dispara el reintento
    clearConnectTimeoutTimer()
    connectTimeoutTimer = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        setStatus('error')
        ws.close()
      }
    }, CONNECT_TIMEOUT_MS)

    ws.onopen = () => {
      clearConnectTimeoutTimer()
      reconnectAttempt = 0
      setStatus('connected')
    }
    ws.onmessage = (event) => {
      messageListeners.forEach(cb => cb(event.data))
    }
    ws.onerror = () => {
      setStatus('error')
    }
    ws.onclose = () => {
      clearConnectTimeoutTimer()
      if (closedByClient) { setStatus('disconnected'); return }
      scheduleReconnect()
    }
  }

  const disconnect = () => {
    closedByClient = true
    clearReconnectTimer()
    clearConnectTimeoutTimer()
    socket?.close()
    socket = null
    setStatus('disconnected')
  }

  const send = (data: unknown) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data))
  }

  const onMessage = (cb: (raw: string) => void) => {
    messageListeners.add(cb)
    return () => messageListeners.delete(cb)
  }

  const onStatusChange = (cb: (status: SocketConnectionStatus) => void) => {
    statusListeners.add(cb)
    return () => statusListeners.delete(cb)
  }

  return { connect, disconnect, send, onMessage, onStatusChange, getStatus: () => status }
}