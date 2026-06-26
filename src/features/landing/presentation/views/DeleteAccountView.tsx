import { useState, type FormEvent } from 'react'
import { apiClient } from '../../../../core/network/client'

type Status = 'idle' | 'loading' | 'success' | 'error'

const C = {
  bg:      '#0A0A0B',
  card:    '#111113',
  border:  '#1F1F22',
  input:   '#0D0D0F',
  green:   '#22C55E',
  text:    '#F4F4F5',
  muted:   '#71717A',
  faint:   '#52525B',
  red:     '#F43F5E',
}

const labelStyle: React.CSSProperties = {
  display: 'block', color: C.muted, fontSize: 12, fontWeight: 600,
  letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10,
  backgroundColor: C.input, border: `1px solid ${C.border}`, color: C.text,
  fontSize: 14, outline: 'none',
}

const DeleteAccountView = () => {
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError]   = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !reason.trim()) {
      setError('Completa todos los campos.')
      return
    }
    setStatus('loading')
    setError(null)
    try {
      await apiClient.post('/auth/delete-account-request', {
        name: name.trim(), email: email.trim(), reason: reason.trim(),
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud. Intenta de nuevo.')
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh', backgroundColor: C.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 520, backgroundColor: C.card,
          border: `1px solid ${C.border}`, borderRadius: 18, padding: 32,
        }}
      >
        {/* ── Marca ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.green }} />
          <span style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>Nich-Ká</span>
        </div>

        {status === 'success' ? (
          <div role="status" aria-live="polite" style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                backgroundColor: `${C.green}1A`, border: `1px solid ${C.green}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: '0 0 10px' }}>
              Solicitud recibida
            </h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Hemos registrado tu solicitud de eliminación de cuenta. Tu cuenta y tus
              datos se eliminarán en un plazo máximo de <strong style={{ color: C.text }}>72 horas</strong>.
              Te enviaremos una confirmación al correo proporcionado.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ color: C.text, fontSize: 26, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Eliminar cuenta
            </h1>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
              Solicita la eliminación de tu cuenta y todos tus datos asociados. Una vez
              recibida tu solicitud, tu cuenta se eliminará en un plazo máximo de{' '}
              <strong style={{ color: C.text }}>72 horas</strong>. Esta acción es permanente.
            </p>

            <form onSubmit={submit} noValidate>
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="name" style={labelStyle}>Nombre completo</label>
                <input
                  id="name" name="name" type="text" autoComplete="name" required
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre" style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label htmlFor="email" style={labelStyle}>Correo electrónico</label>
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com" style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label htmlFor="reason" style={labelStyle}>Motivo</label>
                <textarea
                  id="reason" name="reason" required rows={4}
                  value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="¿Por qué deseas eliminar tu cuenta?"
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 96, fontFamily: 'inherit' }}
                />
              </div>

              {error && (
                <p role="alert" style={{ color: C.red, fontSize: 13, margin: '12px 0 0' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%', marginTop: 20, padding: '13px 16px', borderRadius: 10,
                  border: 'none', cursor: status === 'loading' ? 'default' : 'pointer',
                  backgroundColor: C.green, color: '#06210F', fontSize: 14, fontWeight: 700,
                  opacity: status === 'loading' ? 0.6 : 1,
                }}
              >
                {status === 'loading' ? 'Enviando…' : 'Solicitar eliminación'}
              </button>
            </form>

            <p style={{ color: C.faint, fontSize: 12, lineHeight: 1.6, margin: '18px 0 0', textAlign: 'center' }}>
              Al enviar, aceptas que tu cuenta y datos se eliminen de forma permanente.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

export default DeleteAccountView
