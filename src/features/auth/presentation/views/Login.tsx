import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { useLoginViewModel } from '../viewmodels/useLoginViewModel'
import { cn } from '../../../../lib/utils'
import { PointerHighlight } from '../../../../components/ui/pointer-highlight'
import Text3DFlip from '../../../../components/ui/text-3d-flip'
import { sileo } from 'sileo'

const panel = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = {
  hidden:   { opacity: 0, y: 18 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

const COL1 = [
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
]
const COL2 = [
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
  'https://images.unsplash.com/photo-1559525839-8c4c01c1dee2?w=600&q=80',
  'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&q=80',
  'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&q=80',
]
const COL3 = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
  'https://images.unsplash.com/photo-1559525839-8c4c01c1dee2?w=600&q=80',
]

const EyeIcon = ({ open }: { open: boolean }) => open
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const Login = () => {
  const location = useLocation()
  const { email, setEmail, password, setPassword, loading, error, handleSubmit } = useLoginViewModel()
  const [showPass, setShowPass] = useState(false)
  const justRegistered = location.state?.registered === true

  useEffect(() => {
    if (error) {
      sileo.error({ title: 'Error al iniciar sesión', description: error, fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
    }
  }, [error])
  const registeredEmail = location.state?.email as string | undefined

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B]">
      <motion.div
        className="flex-1 flex flex-col justify-center px-12 py-16 max-w-xl"
        variants={panel}
        initial="hidden"
        animate="visible"
      >

        <motion.div variants={item}>
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <img src="/assets/logo.svg" alt="Fermest" className="w-8 h-8 object-contain cursor-pointer" />
            <span className="text-white font-bold text-lg tracking-tight">Nich-Ká</span>
          </Link>
        </motion.div>

        <motion.div variants={item} className="flex flex-col gap-3 mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">¡Bienvenido de nuevo!</h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
            Monitorea y optimiza la fermentación de tu café con inteligencia artificial en tiempo real.
          </p>
        </motion.div>

        {justRegistered && (
          <motion.div variants={item} className="flex items-start gap-2.5 rounded-lg px-4 py-3 mb-6 text-sm text-green-400 bg-green-950/40 border border-green-500/20">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>
              Cuenta creada correctamente.{' '}
              {registeredEmail && <span className="text-green-300">{registeredEmail}</span>}
              {' '}ya puede iniciar sesión.
            </span>
          </motion.div>
        )}

        <motion.form variants={item} onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400 font-medium">Correo electrónico</label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border border-neutral-800 outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-neutral-400 font-medium">Contraseña</label>
              <Link to="/forgot-password" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-white placeholder:text-neutral-600 bg-neutral-900 border border-neutral-800 outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                <EyeIcon open={showPass} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn('w-full rounded-lg py-3 text-sm font-semibold text-black mt-1 transition-all duration-200 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed')}
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Iniciando sesión...
                </span>
              : 'Iniciar sesión'
            }
          </button>
        </motion.form>

        <motion.div variants={item} className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-600 text-xs">o</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL}/auth/google` }}
            className="flex items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-medium text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL}/auth/github` }}
            className="flex items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-medium text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </motion.div>

        <motion.p variants={item} className="text-center text-sm text-neutral-600 mt-8">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-white hover:text-neutral-200 font-medium transition-colors">
            Regístrate
          </Link>
        </motion.p>
      </motion.div>

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
            <span className="text-4xl text-white/90">pH, temperatura y perfil de sabor</span>
            <span className="text-4xl text-white/90">monitoreados con</span>
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
                inteligencia artificial
              </Text3DFlip>
            </PointerHighlight>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login