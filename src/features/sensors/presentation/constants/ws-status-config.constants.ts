import type { WsStatus } from '../types/ws-status.types'

export const WS_STATUS_CONFIG: Record<WsStatus, { label: string; color: string; pulse: boolean }> = {
  connected:    { label: 'En vivo',      color: '#22C55E', pulse: true  },
  connecting:   { label: 'Conectando…',  color: '#F59E0B', pulse: true  },
  disconnected: { label: 'Desconectado', color: '#3F3F46', pulse: false },
  error:        { label: 'Error',        color: '#F43F5E', pulse: false },
}
