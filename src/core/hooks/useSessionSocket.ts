import { useEffect, useRef } from 'react'
import { useUserAuth } from './userAuth'

const WS = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws').replace(/\/api$/, '')

/**
 * Mantiene un WebSocket de presencia (/ws/session) abierto mientras el usuario
 * está autenticado. Si el backend empuja `session:revoked` (porque se inició
 * sesión en otro dispositivo), expulsa la sesión al instante: limpia el estado
 * y dispara `session_expired`, que SessionWatcher convierte en el modal.
 *
 * Reconecta automáticamente si la conexión se cae por red, salvo cuando la
 * sesión ya fue revocada (no reconectar hacia un 4401 en bucle).
 */
export const useSessionSocket = () => {
  const { user } = useUserAuth()
  const wsRef      = useRef<WebSocket | null>(null)
  const retryRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const revokedRef = useRef(false)
  const attemptRef = useRef(0)

  useEffect(() => {
    const userId = user?.id
    if (!userId) return

    revokedRef.current = false
    let closedByEffect = false

    const connect = () => {
      const ws = new WebSocket(`${WS}/ws/session`)
      wsRef.current = ws

      ws.onopen = () => { attemptRef.current = 0 }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'session:revoked') {
            revokedRef.current = true
            localStorage.removeItem('user_data')
            localStorage.removeItem('profile_image')
            window.dispatchEvent(new CustomEvent('session_expired', { detail: 'SESSION_REPLACED' }))
          }
        } catch { /* ignore */ }
      }

      ws.onclose = (e) => {
        // 4401 = sesión ya inválida; o cierre por desmontaje → no reconectar
        if (closedByEffect || revokedRef.current || e.code === 4401) return
        const delay = Math.min(1000 * 2 ** attemptRef.current, 15000)
        attemptRef.current += 1
        retryRef.current = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      closedByEffect = true
      if (retryRef.current) clearTimeout(retryRef.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])
}
