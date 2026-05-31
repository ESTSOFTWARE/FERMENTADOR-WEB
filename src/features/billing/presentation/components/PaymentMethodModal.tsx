import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'

interface Props {
  open:              boolean
  loadingStripe:     boolean
  onClose:           () => void
  onSelectStripe:    () => void
  onSelectPayPal:    () => void
}

const PaymentMethodModal = ({ open, loadingStripe, onClose, onSelectStripe, onSelectPayPal }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="relative w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ background: '#111113', border: '1px solid #2a2a2d' }}
        >
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid #2a2a2d' }}>
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo.svg" alt="Nich-Ká" className="w-6 h-6" />
              <span style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600 }}>Método de pago</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#1f1f22', color: '#71717a' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-3">
            <p className="text-sm text-[#71717a] text-center mb-1">¿Cómo deseas pagar?</p>

            {/* Stripe */}
            <button
              onClick={onSelectStripe}
              disabled={loadingStripe}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border transition-all duration-150 disabled:opacity-50"
              style={{ background: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5' }}
            >
              <svg viewBox="0 0 60 25" className="h-5 shrink-0" fill="none">
                <path d="M27.3 8.4c0-1.6 1.3-2.2 3.5-2.2 3.1 0 7 1 10.1 2.7V2.1C37.8.8 34.7.2 31.6.2c-7.2 0-12 3.7-12 10 0 9.7 13.4 8.2 13.4 12.4 0 1.9-1.7 2.5-4 2.5-3.5 0-8-1.4-11.5-3.3v7c3.9 1.7 7.8 2.4 11.5 2.4 8.7 0 14.6-4.3 14.6-10.7-.1-10.5-13.3-8.6-13.3-12.1z" fill="#635BFF"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Tarjeta de crédito / débito</span>
                <span className="text-xs text-[#71717a]">Visa, Mastercard, American Express</span>
              </div>
              {loadingStripe && (
                <svg className="animate-spin w-4 h-4 ml-auto text-[#71717a]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
            </button>

            {/* PayPal */}
            <button
              onClick={onSelectPayPal}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border transition-all duration-150"
              style={{ background: '#18181b', borderColor: '#3f3f46', color: '#f4f4f5' }}
            >
              <svg viewBox="0 0 24 24" className="h-5 shrink-0" fill="none">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c1.379 8.895-5.274 11.353-10.5 11.353H8.177l-1.39 8.813h3.97a.75.75 0 0 0 .74-.633l.03-.164.591-3.748.038-.206a.75.75 0 0 1 .74-.633h.467c3.025 0 5.395-.615 6.683-2.394.75-1.039 1.047-2.263.946-3.847z" fill="#003087"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">PayPal</span>
                <span className="text-xs text-[#71717a]">Saldo PayPal o tarjeta vinculada</span>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default PaymentMethodModal
