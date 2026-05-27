import { motion } from 'motion/react'
import { HexagonPattern } from '../../../../components/ui/hexagon-pattern'
import { ImageAccordion } from '../../../../components/ui/interactive-image-accordion'
import { cn } from '../../../../lib/utils'

const ACCORDION_ITEMS = [
  {
    id: 1,
    title: 'Brecha instrumental',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
  },
  {
    id: 2,
    title: 'Aprendizaje desconectado',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  },
  {
    id: 3,
    title: 'Costos inaccesibles',
    imageUrl: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&q=80',
  },
  {
    id: 4,
    title: 'Sin datos en tiempo real',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  },
  {
    id: 5,
    title: 'Propuesta: Nich-Ká',
    imageUrl: '/assets/nich-ka.png',
  },
]

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

      {/* Top: heading left + accordion right */}
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

        {/* Right — accordion */}
        <motion.div
          className="w-full lg:w-auto"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.1 }}
        >
          <ImageAccordion items={ACCORDION_ITEMS} defaultIndex={4} />
        </motion.div>

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
