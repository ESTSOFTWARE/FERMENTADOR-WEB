import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useEntitlements } from '../../core/hooks/useEntitlements'
import { BioreactorVisual } from '../../features/landing/presentation/components/bioreactor/BioreactorVisual'

/** Página (no modal) que se muestra al entrar a una función que el plan no incluye. */
const UpgradeView = () => {
  const navigate = useNavigate()
  const { plan } = useEntitlements()
  const hasPlan  = plan !== 'free'
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1)

  const title    = hasPlan ? 'Esta función no está en tu plan' : 'No tienes una suscripción activa'
  const subtitle = hasPlan
    ? `Tu plan actual es ${planName}. Sube a un plan superior para desbloquear esta función.`
    : 'Actualiza tu plan para desbloquear esta función y todo lo que Nich-Ká tiene para tu laboratorio.'
  const cta      = hasPlan ? 'Subir de plan' : 'Ver planes'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: 'calc(100vh - 3.5rem)', backgroundColor: '#0A0A0B',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 48, textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Spotlight redondo arriba */}
      <div
        style={{
          position: 'absolute', top: -420, left: '50%', transform: 'translateX(-50%)',
          width: 760, height: 760, borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 42%, transparent 68%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Fermentador animado (centrado) */}
        <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ transform: 'scale(0.5)', flexShrink: 0 }}>
            <BioreactorVisual rotX={0} rotY={0} />
          </div>
        </div>

        <h1 style={{ color: '#F4F4F5', fontSize: 28, fontWeight: 700, margin: '4px 0 12px', fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h1>
        <p style={{ color: '#A1A1AA', fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 0 28px' }}>
          {subtitle}
        </p>

        <button
          onClick={() => navigate('/planes')}
          style={{
            padding: '14px 32px', borderRadius: 12, border: 'none',
            background: '#22C55E', color: '#06210F', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
          }}
        >
          {cta}
        </button>
      </div>
    </motion.div>
  )
}

export default UpgradeView
