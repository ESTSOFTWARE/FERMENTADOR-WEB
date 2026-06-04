import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useSessionSocket } from '../hooks/useSessionSocket'

// Rutas públicas donde NO tiene sentido alertar por un 401
const PUBLIC_PATHS = new Set([
  '/', '/login', '/register', '/forgot-password', '/auth/callback',
  '/privacy', '/terms', '/cookies', '/hardware', '/planes',
  '/consultoria', '/mantenimiento', '/products',
])

type Reason = 'session_replaced' | 'expired'

const MESSAGES: Record<Reason, { title: string; body: string }> = {
  session_replaced: {
    title: 'Tu sesión se cerró',
    body:  'Se inició sesión con tu cuenta en otro dispositivo. Por seguridad, solo puede haber una sesión activa a la vez.',
  },
  expired: {
    title: 'Sesión finalizada',
    body:  'Tu sesión expiró. Vuelve a iniciar sesión para continuar.',
  },
}

/**
 * Escucha el evento global `session_expired` (emitido por el cliente HTTP ante
 * un 401). Muestra un modal bloqueante; al aceptar, redirige al login.
 */
const SessionWatcher = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [reason, setReason] = useState<Reason | null>(null)

  // WebSocket de presencia: expulsión instantánea al iniciar sesión en otro dispositivo
  useSessionSocket()

  useEffect(() => {
    const onExpired = (e: Event) => {
      if (PUBLIC_PATHS.has(location.pathname)) return
      const detail = (e as CustomEvent).detail
      setReason(detail === 'SESSION_REPLACED' ? 'session_replaced' : 'expired')
    }
    window.addEventListener('session_expired', onExpired)
    return () => window.removeEventListener('session_expired', onExpired)
  }, [location.pathname])

  const accept = () => {
    setReason(null)
    navigate('/login', { replace: true })
  }

  const msg = reason ? MESSAGES[reason] : null

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ background: '#111113', border: '1px solid #2a2a2d' }}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </div>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg font-semibold text-white">{msg.title}</h2>
                <p className="text-sm leading-relaxed text-[#a1a1aa]">{msg.body}</p>
              </div>

              <button
                onClick={accept}
                className="mt-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: '#f4f4f5', color: '#0a0a0b' }}
              >
                Aceptar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SessionWatcher
