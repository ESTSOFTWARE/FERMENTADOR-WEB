import { motion } from 'motion/react'
import { HexagonPattern } from '../../../../components/ui/hexagon-pattern'
import { cn } from '../../../../lib/utils'

const PHONES = [
  { src: '/assets/login.png', alt: 'Inicio de sesión', z: 10, x: -135, rotate: -8, scale: 0.86, delay: 0.15, float: 6.5 },
  { src: '/assets/overview.png', alt: 'Panel principal', z: 30, x: 0, rotate: 0, scale: 1, delay: 0.45, float: 8.5 },
  { src: '/assets/sensores.png', alt: 'Sensores en vivo', z: 20, x: 135, rotate: 8, scale: 0.86, delay: 0.75, float: 7.5 },
]

const Phone = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} style={{ width: 310 }} />
)

const ProblemStatement = () => (
  <section className="relative w-full overflow-hidden" style={{ background: '#0F8E4D' }}>

    <HexagonPattern
      hexagons={[[1,1],[4,4],[2,2],[3,4],[5,4],[8,2],[6,3],[8,5],[10,10],[12,3],[7,7],[3,8]]}
      className={cn(
        'absolute inset-0 z-0 [&_svg]:w-full [&_svg]:h-full',
        'mask-[radial-gradient(600px_circle_at_center,white,transparent)]',
      )}
      radius={36}
    />

    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-20">

      {/* Top: heading left + app promo right */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left — text */}
        <motion.div
          className="flex flex-col gap-6 lg:max-w-md"
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">Contexto</span>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
            Planteamiento<br />del problema
          </h2>
          <div className="w-12 h-1 rounded-full bg-white/40" />
          <p className="text-white/70 text-sm leading-relaxed">
            La enseñanza práctica de la fermentación enfrenta una brecha crítica: formación sin datos,
            sin monitoreo continuo y sin herramientas al alcance de las instituciones educativas de Latinoamérica.
          </p>
          <ul className="flex flex-col gap-3 mt-2">
            {[
              'Laboratorios sin equipamiento de monitoreo continuo',
              'Soluciones industriales fuera del presupuesto institucional ($15K+ USD)',
              'Aprendizaje teórico sin interpretación de dinámicas reales',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — App phones animation */}
        <div className="relative h-[520px] w-full lg:w-1/2 flex items-center justify-center">
          {PHONES.map((p) => (
            <motion.div
              key={p.src}
              className="absolute"
              style={{ zIndex: p.z }}
              initial={{ opacity: 0, y: 90, rotate: p.rotate, scale: p.scale }}
              whileInView={{ opacity: 1, y: 0, x: p.x, rotate: p.rotate, scale: p.scale }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: p.delay }}
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: p.float, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Phone src={p.src} alt={p.alt} />
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Bottom: pregunta + respuesta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Pregunta */}
        <motion.div
          className="relative flex flex-col justify-between gap-6 p-8 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.1 }}
        >
          <span className="pointer-events-none absolute -top-4 -right-2 text-[9rem] font-black leading-none select-none" style={{ color: 'rgba(255,255,255,0.07)' }}>?</span>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <span className="text-xs uppercase tracking-[0.25em] text-white/50 font-semibold">Pregunta central</span>
          </div>

          <p className="text-white font-black text-xl md:text-2xl leading-snug tracking-tight">
            ¿Cómo cerrar la brecha entre la formación teórica en fermentación y la práctica instrumentada sin que el costo sea una barrera institucional?
          </p>

          <div className="flex gap-2 flex-wrap">
            {['Educación', 'Instrumentación', 'Accesibilidad'].map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white/60" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Respuesta */}
        <motion.div
          className="relative flex flex-col justify-between gap-6 p-8 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)' }} />

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-white/50 font-semibold">Respuesta</span>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-white font-black text-2xl md:text-3xl tracking-tight">Nich-Ká</p>
            <p className="text-white/80 text-sm leading-relaxed">
              Un sistema que integra <span className="text-white font-semibold">hardware accesible (&lt;$1,000 USD)</span>, monitoreo IoT en tiempo real, <span className="text-white font-semibold">modelos de ML propios</span> y reportes en lenguaje natural mediante NLP local — diseñado con un modelo pedagógico multi-rol para el flujo docente-estudiante institucional.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['IoT', 'ML propio', 'NLP local', 'Multi-rol', '<$1,000 USD'].map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white/60" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>{t}</span>
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  </section>
)

export default ProblemStatement