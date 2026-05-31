import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

interface CheckoutModalProps {
  clientSecret: string
  open:         boolean
  onClose:      () => void
}

const CheckoutModal = ({ clientSecret, open, onClose }: CheckoutModalProps) => (
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
          className="relative w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: '#111113', border: '1px solid #2a2a2d', maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid #2a2a2d' }}>
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo.svg" alt="Nich-Ká" className="w-6 h-6" />
              <span style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600 }}>Nich-Ká</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ background: '#1f1f22', color: '#71717a' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stripe Embedded Checkout */}
          <div className="p-4">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default CheckoutModal
