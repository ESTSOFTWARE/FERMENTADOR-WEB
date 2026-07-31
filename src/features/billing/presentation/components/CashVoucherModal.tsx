import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, ExternalLink, X } from 'lucide-react'
import type { CashPayment } from '../../domain/models/Subscription'

interface Props {
  open:        boolean
  loading:     boolean
  payment:     CashPayment | null
  onClose:     () => void
  pollStatus:  (paymentId: number) => Promise<CashPayment>
  onSucceeded: () => void
}

const formatMxn = (centavos: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(centavos / 100)

const Shell = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: 16 }}
    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    className="relative w-full max-w-sm rounded-2xl overflow-hidden"
    style={{ background: '#111113', border: '1px solid #2a2a2d' }}
  >
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #2a2a2d' }}>
      <div className="flex items-center gap-2.5">
        <img src="/assets/logo.svg" alt="Nich-Ká" className="w-6 h-6" />
        <span style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 600 }}>{title}</span>
      </div>
      <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: '#1f1f22', color: '#71717a' }}>
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
    {children}
  </motion.div>
)

const CashVoucherModal = ({ open, loading, payment, onClose, pollStatus, onSucceeded }: Props) => {
  const [status, setStatus] = useState<CashPayment['status']>(payment?.status ?? 'pending')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open || !payment || status !== 'pending') return
    const id = setInterval(async () => {
      try {
        const updated = await pollStatus(payment.payment_id)
        setStatus(updated.status)
        if (updated.status === 'succeeded') onSucceeded()
      } catch { /* reintenta en el siguiente tick */ }
    }, 5000)
    return () => clearInterval(id)
  }, [open, payment, status, pollStatus, onSucceeded])

  const isOxxo    = payment?.provider === 'oxxo'
  const reference = payment ? (isOxxo ? payment.reference : (payment.clabe ?? payment.reference)) : null

  const copy = (value: string | null) => {
    if (!value) return
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose() }}
        >
          {/* Estado 1: generando (spinner) */}
          {loading || !payment ? (
            <Shell title="Generando tu pago…" onClose={onClose}>
              <div className="p-10 flex flex-col items-center gap-4 text-center">
                <svg className="animate-spin w-9 h-9" viewBox="0 0 24 24" fill="none" style={{ color: '#4ade80' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <p className="text-sm text-[#a1a1aa]">Estamos generando tu referencia de pago…</p>
              </div>
            </Shell>
          ) : status === 'succeeded' ? (
            /* Estado 3: pago confirmado */
            <Shell title={isOxxo ? 'Pago en OXXO' : 'Transferencia SPEI'} onClose={onClose}>
              <div className="p-8 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <Check className="w-7 h-7" style={{ color: '#4ade80' }} />
                </div>
                <h2 className="text-lg font-bold text-[#f4f4f5]">¡Pago confirmado!</h2>
                <p className="text-sm text-[#a1a1aa]">Tu suscripción ya está activa.</p>
              </div>
            </Shell>
          ) : (
            /* Estado 2: pago pendiente (voucher / CLABE) */
            <Shell title={isOxxo ? 'Pago en OXXO' : 'Transferencia SPEI'} onClose={onClose}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg self-start"
                  style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)' }}>
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs font-medium text-yellow-400">Pago pendiente</span>
                </div>

                <p className="text-sm text-[#a1a1aa] leading-relaxed">
                  {isOxxo
                    ? 'Presenta esta referencia en la caja de cualquier OXXO y paga en efectivo. Tu plan se activa automáticamente cuando confirmen el pago (puede tardar unas horas).'
                    : 'Realiza una transferencia SPEI desde tu banca a esta CLABE. Tu plan se activa automáticamente cuando llegue el pago.'}
                </p>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: '#18181b', border: '1px solid #2a2a2d' }}>
                  <span className="text-xs text-[#71717a]">Monto</span>
                  <span className="text-base font-bold text-[#f4f4f5]">{formatMxn(payment.amount_mxn)} MXN</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-[#71717a]">{isOxxo ? 'Referencia' : 'CLABE'}</span>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: '#18181b', border: '1px solid #2a2a2d' }}>
                    <span className="text-sm font-mono text-[#f4f4f5] break-all flex-1">{reference ?? '—'}</span>
                    <button onClick={() => copy(reference)} className="shrink-0 text-[#71717a] hover:text-[#f4f4f5] transition-colors">
                      {copied ? <Check className="w-4 h-4" style={{ color: '#4ade80' }} /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isOxxo && payment.concepto && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-[#71717a]">Concepto</span>
                    <div className="px-4 py-3 rounded-xl" style={{ background: '#18181b', border: '1px solid #2a2a2d' }}>
                      <span className="text-sm font-mono text-[#f4f4f5] break-all">{payment.concepto}</span>
                    </div>
                  </div>
                )}

                {payment.expires_at && (
                  <p className="text-xs text-[#71717a]">
                    Vence: {new Date(payment.expires_at).toLocaleString('es-MX')}
                  </p>
                )}

                {isOxxo && payment.voucher_url && (
                  <a href={payment.voucher_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150"
                    style={{ background: '#22c55e', color: '#0a0a0b' }}>
                    <ExternalLink className="w-4 h-4" />
                    Ver / imprimir voucher
                  </a>
                )}

                <p className="text-xs text-[#52525b] text-center">
                  Puedes cerrar esta ventana; el pago se confirma solo.
                </p>
              </div>
            </Shell>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CashVoucherModal
