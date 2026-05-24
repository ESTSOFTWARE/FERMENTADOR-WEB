import type { WsStatus } from '../types/ws-status.types'

const WS_CONFIG: Record<WsStatus, { label: string; color: string }> = {
  connected:    { label: 'En vivo',      color: '#22C55E' },
  connecting:   { label: 'Conectando…',  color: '#F59E0B' },
  disconnected: { label: 'Desconectado', color: '#52525B' },
  error:        { label: 'Error WS',     color: '#F43F5E' },
}

const WsIndicator = ({ status }: { status: WsStatus }) => {
  const { label, color } = WS_CONFIG[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color, display: 'inline-block', boxShadow: status === 'connected' ? `0 0 8px ${color}` : 'none', animation: status === 'connecting' ? 'pulse 1.2s infinite' : 'none' }} />
      <span style={{ color, fontSize: 11, fontWeight: 500, letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  )
}

export default WsIndicator
