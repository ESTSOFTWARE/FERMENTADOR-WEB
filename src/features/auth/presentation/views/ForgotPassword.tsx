import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '../../../../lib/utils'
import { PointerHighlight } from '../../../../components/ui/pointer-highlight'
import Text3DFlip from '../../../../components/ui/text-3d-flip'
import { COL1, COL2, COL3 } from '../constants/auth-gallery.constants'
import { authPanelVariants, authItemVariants } from '../constants/auth.variants'
import { EyeIcon } from '../components/EyeIcon'
import { OtpInput } from '../../../../components/ui/otp-input'
import { useForgotPasswordViewModel } from '../viewmodels/useForgotPasswordViewModel'

const ForgotPassword = () => {
  const {
    step, email, setEmail,
    code, setCode,
    password, setPassword,
    confirm, setConfirm,
    loading, error,
    handleSendCode, handleReset,
    goToEmail,
  } = useForgotPasswordViewModel()

  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B]">

      {/* ── Left panel ── */}
      <motion.div
        className="flex-1 flex flex-col justify-center px-12 py-16 max-w-xl"
        variants={authPanelVariants} initial="hidden" animate="visible"
      >
        <motion.div variants={authItemVariants}>
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <img src="/assets/logo.svg" alt="Nich-Ká" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-lg tracking-tight">Nich-Ká</span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <motion.div key="email"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }} className="flex flex-col gap-0">

              <div className="flex flex-col gap-3 mb-10">
                <h1 className="text-4xl font-black text-white tracking-tight">¿Olvidaste tu contraseña?</h1>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                  Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
                </p>
              </div>

              <form onSubmit={handleSendCode} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-400 font-medium">Correo electrónico</label>
                  <input
                    type="email" required autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border border-neutral-800 outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full rounded-lg py-3 text-sm font-semibold text-black mt-1 transition-all duration-200 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Enviando código...
                      </span>
                    : 'Enviar código'
                  }
                </button>
              </form>

              <p className="text-center text-sm text-neutral-600 mt-8">
                <Link to="/login" className="text-white hover:text-neutral-200 font-medium transition-colors">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </motion.div>
          )}

          {/* ── Step 2: Code + new password ── */}
          {step === 'code' && (
            <motion.div key="code"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }} className="flex flex-col gap-0">

              <div className="flex flex-col gap-3 mb-10">
                <h1 className="text-4xl font-black text-white tracking-tight">Revisa tu correo</h1>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                  Enviamos un código de 6 dígitos a{' '}
                  <span className="text-white font-medium">{email}</span>.
                  Ingrésalo junto con tu nueva contraseña.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 mb-5 text-sm text-red-400 bg-red-950/40 border border-red-500/20">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-400 font-medium">Código de verificación</label>
                  <OtpInput value={code} onChange={setCode} length={6} disabled={loading} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-400 font-medium">Nueva contraseña</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'} required
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border border-neutral-800 outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-neutral-400 font-medium">Confirmar contraseña</label>
                  <div className="relative">
                    <input
                      type={showConf ? 'text' : 'password'} required
                      value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className={cn(
                        'w-full rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border outline-none transition-all duration-200',
                        confirm && confirm !== password
                          ? 'border-red-500/50 focus:ring-1 focus:ring-red-500/20'
                          : 'border-neutral-800 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20'
                      )}
                    />
                    <button type="button" onClick={() => setShowConf(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                      <EyeIcon open={showConf} />
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading || code.length < 6}
                  className="w-full rounded-lg py-3 text-sm font-semibold text-black mt-1 transition-all duration-200 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Restableciendo...
                      </span>
                    : 'Restablecer contraseña'
                  }
                </button>
              </form>

              <p className="text-center text-sm text-neutral-600 mt-6">
                ¿No recibiste el código?{' '}
                <button onClick={goToEmail} className="text-white hover:text-neutral-200 font-medium transition-colors">
                  Reenviar
                </button>
              </p>
            </motion.div>
          )}

          {/* ── Step 3: Done ── */}
          {step === 'done' && (
            <motion.div key="done"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }} className="flex flex-col gap-0">

              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8">
                <svg className="w-7 h-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>

              <div className="flex flex-col gap-3 mb-10">
                <h1 className="text-4xl font-black text-white tracking-tight">¡Contraseña restablecida!</h1>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                  Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>

              <Link to="/login"
                className="w-full rounded-lg py-3 text-sm font-semibold text-black text-center transition-all duration-200 bg-white hover:bg-neutral-200">
                Ir al inicio de sesión
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>

      {/* ── Right panel: same scrolling photos as Login ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <style>{`
          @keyframes scrollDown { from { transform: translateY(-50%); } to { transform: translateY(0%); } }
          @keyframes scrollUp   { from { transform: translateY(0%);   } to { transform: translateY(-50%); } }
        `}</style>

        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0a1a0f 0%,#0f2d1a 30%,#1a4a2a 60%,#2d6b3f 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(15,142,77,0.22), transparent), radial-gradient(ellipse 50% 40% at 20% 20%, rgba(74,222,128,0.08), transparent)' }} />

        <div className="absolute inset-0 flex gap-2.5 px-5 overflow-hidden">
          {[COL1, COL2, COL3].map((col, ci) => (
            <div key={ci} className="flex-1 overflow-hidden">
              <div style={{ animation: `${ci % 2 === 0 ? 'scrollDown' : 'scrollUp'} ${10 + ci * 2}s linear infinite` }}>
                {[...col, ...col].map((src, i) => (
                  <div key={i} className="mb-2.5 rounded-xl overflow-hidden">
                    <img src={src} alt="" className="w-full object-cover" style={{ filter: 'brightness(0.65) saturate(0.85)' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 h-28 pointer-events-none" style={{ background: 'linear-gradient(to bottom,#0a1a0f,transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none" style={{ background: 'linear-gradient(to top,#0a1a0f,transparent)' }} />

        <div className="absolute top-8 left-0 z-10 w-full">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 200% at 0% 50%, rgba(5,15,8,0.88) 0%, rgba(5,15,8,0.55) 40%, rgba(5,15,8,0.15) 65%, transparent 85%)' }} />
          <motion.div
            className="relative flex flex-col gap-2 font-black tracking-tight leading-tight px-10 py-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="text-4xl text-white/90">Tus experimentos, sensores</span>
            <span className="text-4xl text-white/90">y reportes protegidos con</span>
            <PointerHighlight
              rectangleClassName="border-green-500/50 bg-green-500/8"
              pointerClassName="text-green-400"
            >
              <Text3DFlip
                className="bg-transparent justify-start"
                textClassName="text-5xl font-black tracking-tighter bg-linear-to-b from-green-300 to-green-500 bg-clip-text text-transparent"
                flipTextClassName="text-5xl font-black tracking-tighter bg-linear-to-b from-green-400 to-green-600 bg-clip-text text-transparent"
                rotateDirection="top"
                staggerDuration={0.03}
                staggerFrom="first"
                transition={{ type: 'spring', damping: 25, stiffness: 160 }}
              >
                total seguridad
              </Text3DFlip>
            </PointerHighlight>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
