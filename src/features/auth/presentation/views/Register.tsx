import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { useRegisterViewModel } from '../viewmodels/useRegisterViewModel'
import { cn } from '../../../../lib/utils'
import Text3DFlip from '../../../../components/ui/text-3d-flip'
import { Checkbox } from '../../../../components/ui/checkbox'
import { sileo } from 'sileo'

const COL1 = [
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
  'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&q=80',
  'https://images.unsplash.com/photo-1611077543764-4b6a1fe68b25?w=600&q=80',
]
const COL2 = [
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
  'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&q=80',
  'https://images.unsplash.com/photo-1559525839-8c4c01c1dee2?w=600&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&q=80',
]

const panel = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
}

const EyeIcon = ({ open }: { open: boolean }) => open
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Field = 'name' | 'lastName' | 'email' | 'password' | 'confirm'

const Register = () => {
  const {
    name,      setName,
    lastName,  setLastName,
    email,     setEmail,
    password,  setPassword,
    confirm,   setConfirm,
    loading,
    error,
    handleSubmit,
  } = useRegisterViewModel()

  const [showPass, setShowPass]           = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [touched, setTouched]             = useState<Partial<Record<Field, boolean>>>({})

  useEffect(() => {
    if (error) sileo.error({ title: 'No se pudo crear la cuenta', description: error, fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
  }, [error])

  const errors: Record<Field, string> = {
    name:     !name.trim()                          ? 'El nombre es requerido'         : '',
    lastName: !lastName.trim()                      ? 'El apellido es requerido'        : '',
    email:    !email.trim()                         ? 'El correo es requerido'
            : !EMAIL_RE.test(email)                 ? 'Correo electrónico inválido'     : '',
    password: !password                             ? 'La contraseña es requerida'
            : password.length < 8                   ? 'Mínimo 8 caracteres'             : '',
    confirm:  !confirm                              ? 'Confirma tu contraseña'
            : password !== confirm                  ? 'Las contraseñas no coinciden'    : '',
  }

  const touch = (field: Field) => setTouched(prev => ({ ...prev, [field]: true }))
  const fieldErr = (field: Field) => touched[field] && errors[field]

  const inputBase = cn(
    'w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600',
    'bg-neutral-900 border outline-none transition-all duration-200'
  )
  const inputCn = (field: Field, extra?: string) => cn(
    inputBase,
    extra,
    fieldErr(field)
      ? 'border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
      : 'border-neutral-800 focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20'
  )
  const labelBase = 'text-sm text-neutral-400 font-medium'

  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setTouched({ name: true, lastName: true, email: true, password: true, confirm: true })
    if (Object.values(errors).some(Boolean)) return
    handleSubmit(e)
  }

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B]">

      <motion.div
        className="flex-1 flex flex-col justify-center px-12 py-12 max-w-xl overflow-y-auto"
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

        <motion.div variants={item} className="flex flex-col gap-2 mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight">Crea tu cuenta</h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
            Empieza a monitorear y optimizar la fermentación de tu café con IA.
          </p>
        </motion.div>

        <motion.form variants={item} noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Nombre</label>
              <input
                type="text" autoComplete="given-name"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => touch('name')}
                placeholder="Tu nombre"
                className={inputCn('name')}
              />
              {fieldErr('name') && <span className="text-xs text-red-400">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelBase}>Apellido</label>
              <input
                type="text" autoComplete="family-name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                onBlur={() => touch('lastName')}
                placeholder="Tu apellido"
                className={inputCn('lastName')}
              />
              {fieldErr('lastName') && <span className="text-xs text-red-400">{errors.lastName}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Correo electrónico</label>
            <input
              type="email" autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => touch('email')}
              placeholder="tu@correo.com"
              className={inputCn('email')}
            />
            {fieldErr('email') && <span className="text-xs text-red-400">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => touch('password')}
                placeholder="••••••••"
                className={inputCn('password', 'pr-11')}
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                <EyeIcon open={showPass} />
              </button>
            </div>
            {fieldErr('password') && <span className="text-xs text-red-400">{errors.password}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelBase}>Confirmar contraseña</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onBlur={() => touch('confirm')}
                placeholder="••••••••"
                className={inputCn('confirm', 'pr-11')}
              />
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {fieldErr('confirm') && <span className="text-xs text-red-400">{errors.confirm}</span>}
          </div>

          <div className="flex items-start gap-3 mt-1">
            <Checkbox
              id="terms"
              variant="accent"
              checked={acceptedTerms}
              onCheckedChange={(val) => setAcceptedTerms(val === true)}
            />
            <label htmlFor="terms" className="text-xs text-neutral-400 leading-relaxed cursor-pointer select-none">
              He leído y acepto los{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors">
                Términos de uso
              </a>
              {' '}y la{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors">
                Política de privacidad
              </a>{' '}
              vigentes.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="w-full rounded-lg py-3 text-sm font-semibold text-black mt-1 transition-all duration-200 bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creando cuenta...
                </span>
              : 'Crear cuenta'
            }
          </button>
        </motion.form>

        <motion.div variants={item} className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-600 text-xs">o regístrate con</span>
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

        <motion.p variants={item} className="text-center text-sm text-neutral-600 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-white hover:text-neutral-200 font-medium transition-colors">
            Inicia sesión
          </Link>
        </motion.p>
      </motion.div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <style>{`
          @keyframes scrollDown { from { transform: translateY(-50%); } to { transform: translateY(0%); } }
          @keyframes scrollUp   { from { transform: translateY(0%);   } to { transform: translateY(-50%); } }
        `}</style>

        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#0a1a0f 0%,#0f2d1a 30%,#1a4a2a 60%,#2d6b3f 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(15,142,77,0.22), transparent), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(74,222,128,0.08), transparent)' }} />

        <div className="absolute inset-0 flex gap-3 px-6 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div style={{ animation: 'scrollDown 11s linear infinite' }}>
              {[...COL1, ...COL1].map((src, i) => (
                <div key={i} className="mb-3 rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full object-cover rounded-xl" style={{ filter: 'brightness(0.65) saturate(0.8)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div style={{ animation: 'scrollUp 13s linear infinite' }}>
              {[...COL2, ...COL2].map((src, i) => (
                <div key={i} className="mb-3 rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full object-cover rounded-xl" style={{ filter: 'brightness(0.65) saturate(0.8)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom,#0a1a0f,transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top,#0a1a0f,transparent)' }} />

        <div className="absolute top-8 left-0 z-10 w-full">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 200% at 0% 50%, rgba(5,15,8,0.88) 0%, rgba(5,15,8,0.55) 40%, rgba(5,15,8,0.15) 65%, transparent 85%)' }} />
          <motion.div
            className="relative flex flex-col gap-2 font-black tracking-tight leading-tight px-10 py-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="text-4xl text-white/90">Controla cada parámetro</span>
            <span className="text-4xl text-white/90">y perfecciona tu café con</span>
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="text-5xl font-black tracking-tighter bg-linear-to-b from-green-300 to-green-500 bg-clip-text text-transparent"
              flipTextClassName="text-5xl font-black tracking-tighter bg-linear-to-b from-green-400 to-green-600 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: 'spring', damping: 25, stiffness: 160 }}
            >
              inteligencia artificial.
            </Text3DFlip>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register
