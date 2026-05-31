import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { billingApi } from '../../data/api/billingApi'

interface Props {
  plan:          string
  billingCycle:  string
  open:          boolean
  onClose:       () => void
  onSuccess:     (subscriptionId: string) => void
  onError?:      (err: Error) => void
}

const PLAN_LABELS: Record<string, string> = {
  starter:    'Starter',
  academic:   'Academic',
  enterprise: 'Enterprise',
}

const PLAN_PRICES: Record<string, Record<string, string>> = {
  starter:    { monthly: '$49 USD/mes',    annual: '$490 USD/año' },
  academic:   { monthly: '$129 USD/mes',   annual: '$1,290 USD/año' },
  enterprise: { monthly: '$299 USD/mes',   annual: '$2,990 USD/año' },
}

const PayPalSubscriptionModal = ({ plan, billingCycle, open, onClose, onSuccess, onError }: Props) => (
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
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{ background: '#111113', border: '1px solid #2a2a2d' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: '1px solid #2a2a2d' }}>
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo.svg" alt="Nich-Ká" className="w-6 h-6" />
              <span style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600 }}>Suscripción con PayPal</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{ background: '#1f1f22', color: '#71717a' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            {/* Plan summary */}
            {plan && (
              <div
                className="flex items-center justify-between py-3 px-4 rounded-xl"
                style={{ background: '#18181b', border: '1px solid #2a2a2d' }}
              >
                <span className="text-sm text-[#71717a]">Plan {PLAN_LABELS[plan] ?? plan}</span>
                <span className="text-sm font-semibold text-white">
                  {PLAN_PRICES[plan]?.[billingCycle] ?? ''}
                </span>
              </div>
            )}

            <p className="text-xs text-[#71717a] text-center leading-relaxed">
              Se abrirá PayPal para que autorices el cobro recurrente de forma segura.
              Puedes cancelar en cualquier momento desde tu cuenta.
            </p>

            <PayPalScriptProvider
              options={{
                clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                vault:    true,
                intent:   'subscription',
              }}
            >
              <PayPalButtons
                style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'subscribe' }}
                createSubscription={async () => {
                  const { subscription_id } = await billingApi.createPayPalSubscription(plan, billingCycle)
                  return subscription_id
                }}
                onApprove={async (data) => {
                  if (data.subscriptionID) onSuccess(data.subscriptionID)
                }}
                onError={(err) => {
                  const e = err instanceof Error ? err : new Error(String(err))
                  console.error('[PayPal] Error en suscripción:', e)
                  onError?.(e)
                }}
              />
            </PayPalScriptProvider>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default PayPalSubscriptionModal
