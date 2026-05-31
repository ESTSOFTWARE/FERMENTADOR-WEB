import { useState, useEffect } from 'react'
import {
  PayPalScriptProvider,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  usePayPalHostedFields,
  type PayPalHostedFieldsComponentProps,
} from '@paypal/react-paypal-js'
import { AnimatePresence, motion } from 'motion/react'

type HostedFieldsProviderProps = Omit<PayPalHostedFieldsComponentProps, 'notEligible'> & {
  notEligible?: React.ReactNode
}
const HostedFieldsProvider = PayPalHostedFieldsProvider as React.FC<React.PropsWithChildren<HostedFieldsProviderProps>>
import { X, Lock } from 'lucide-react'
import { billingApi } from '../../data/api/billingApi'

export interface PayPalOrderModalProps {
  open:        boolean
  amount:      string
  currency:    string
  description: string
  onClose:     () => void
  onSuccess:   (orderId: string) => void
}

// ── Submit button — must live inside PayPalHostedFieldsProvider ───────────────

interface SubmitProps {
  amount:     string
  currency:   string
  loading:    boolean
  setLoading: (v: boolean) => void
  setError:   (v: string | null) => void
  onSuccess:  (orderId: string) => void
}

const CardSubmitButton = ({ amount, currency, loading, setLoading, setError, onSuccess }: SubmitProps) => {
  const { cardFields } = usePayPalHostedFields()

  const handlePay = async () => {
    if (!cardFields) return
    setError(null)
    setLoading(true)
    try {
      const result = await cardFields.submit({}) as { orderId?: string; orderID?: string }
      const orderId = result.orderId ?? result.orderID
      if (!orderId) throw new Error('No se recibió ID de orden')
      onSuccess(orderId)
    } catch {
      setError('Error al procesar el pago. Verifica los datos de tu tarjeta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: '#f4f4f5', color: '#0a0a0b' }}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Procesando...
        </>
      ) : (
        <>
          <Lock className="w-3.5 h-3.5" />
          Pagar {amount} {currency}
        </>
      )}
    </button>
  )
}

// ── Hosted fields iframe container style ─────────────────────────────────────

const fieldStyle: React.CSSProperties = {
  background:   '#18181b',
  border:       '1px solid #3f3f46',
  borderRadius: '12px',
  height:       '44px',
  padding:      '0 12px',
  display:      'flex',
  alignItems:   'center',
  overflow:     'hidden',
}

// ── PayPalOrderModal ─────────────────────────────────────────────────────────

const PayPalOrderModal = ({ open, amount, currency, description, onClose, onSuccess }: PayPalOrderModalProps) => {
  const [clientToken, setClientToken] = useState<string | null>(null)
  const [tokenError, setTokenError]   = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      void Promise.resolve().then(() => {
        setClientToken(null)
        setTokenError(false)
        setError(null)
      })
      return
    }
    billingApi.getPayPalClientToken()
      .then(({ client_token }) => setClientToken(client_token))
      .catch(() => setTokenError(true))
  }, [open])

  return (
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
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid #2a2a2d' }}
            >
              <div className="flex items-center gap-2.5">
                <img src="/assets/logo.svg" alt="Nich-Ká" className="w-6 h-6" />
                <span style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600 }}>Pago seguro</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#1f1f22', color: '#71717a' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4">

              {/* Amount summary */}
              <div
                className="flex items-center justify-between py-3 px-4 rounded-xl"
                style={{ background: '#18181b', border: '1px solid #2a2a2d' }}
              >
                <span className="text-sm text-[#71717a]">{description}</span>
                <span className="text-sm font-semibold text-white">{amount} {currency}</span>
              </div>

              {/* States: error fetching token / loading token / form */}
              {tokenError ? (
                <p className="text-sm text-red-400 text-center py-4">
                  No se pudo inicializar el formulario. Intenta de nuevo.
                </p>
              ) : !clientToken ? (
                <div className="flex items-center justify-center py-10">
                  <svg className="animate-spin w-5 h-5 text-[#52525b]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="4"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
              ) : (
                <PayPalScriptProvider
                  options={{
                    clientId:        import.meta.env.VITE_PAYPAL_CLIENT_ID,
                    dataClientToken: clientToken,
                    components:      'hosted-fields',
                    intent:          'capture',
                  }}
                >
                  <HostedFieldsProvider
                    createOrder={async () => {
                      const { order_id } = await billingApi.createPayPalOrder(amount, currency, description)
                      return order_id
                    }}
                    notEligible={
                      <p className="text-sm text-center py-4" style={{ color: '#71717a' }}>
                        El pago con tarjeta no está disponible en este momento. Intenta con PayPal.
                      </p>
                    }
                    styles={{
                      'input': {
                        'font-size':   '14px',
                        'font-family': 'inherit',
                        'color':       '#f4f4f5',
                        'padding':     '0 4px',
                      },
                      ':placeholder': { color: '#52525b' },
                      '.valid':        { color: '#4ade80' },
                      '.invalid':      { color: '#f87171' },
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Card number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium" style={{ color: '#71717a' }}>
                          Número de tarjeta
                        </label>
                        <PayPalHostedField
                          hostedFieldType="number"
                          options={{ selector: '#paypal-card-number', placeholder: '4111 1111 1111 1111' }}
                          style={fieldStyle}
                          id="paypal-card-number"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Expiry */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium" style={{ color: '#71717a' }}>
                            Vencimiento
                          </label>
                          <PayPalHostedField
                            hostedFieldType="expirationDate"
                            options={{ selector: '#paypal-expiry', placeholder: 'MM / AA' }}
                            style={fieldStyle}
                            id="paypal-expiry"
                          />
                        </div>
                        {/* CVV */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium" style={{ color: '#71717a' }}>
                            CVV
                          </label>
                          <PayPalHostedField
                            hostedFieldType="cvv"
                            options={{ selector: '#paypal-cvv', placeholder: '···' }}
                            style={fieldStyle}
                            id="paypal-cvv"
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-xs text-red-400">{error}</p>
                      )}

                      <CardSubmitButton
                        amount={amount}
                        currency={currency}
                        loading={loading}
                        setLoading={setLoading}
                        setError={setError}
                        onSuccess={onSuccess}
                      />

                      <div className="flex items-center justify-center gap-1.5">
                        <Lock className="w-3 h-3" style={{ color: '#52525b' }} />
                        <span className="text-[11px]" style={{ color: '#52525b' }}>
                          Cifrado SSL · Procesado por PayPal
                        </span>
                      </div>
                    </div>
                  </HostedFieldsProvider>
                </PayPalScriptProvider>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PayPalOrderModal
