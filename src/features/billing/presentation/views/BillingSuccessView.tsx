import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const BillingSuccessView = () => {
  const navigate       = useNavigate()
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(interval); navigate('/overview'); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        className="bg-[#111113] border border-[#2a2a2d] rounded-2xl p-10 max-w-md w-full text-center flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-[#f4f4f5]">¡Pago exitoso!</h1>
          <p className="text-sm text-[#a1a1aa] leading-relaxed">
            Tu suscripción ha sido activada. Ya tienes acceso a todos los beneficios de tu plan.
          </p>
        </div>

        <div className="h-px w-full bg-[#2a2a2d]" />

        <p className="text-xs text-[#52525b]">
          Redirigiendo al dashboard en{' '}
          <span className="text-[#f4f4f5] font-semibold">{seconds}</span>s
        </p>

        <button
          onClick={() => navigate('/overview')}
          className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-white text-[#0A0A0B] hover:bg-neutral-200 transition-colors"
        >
          Ir al dashboard →
        </button>
      </motion.div>
    </div>
  )
}

export default BillingSuccessView
