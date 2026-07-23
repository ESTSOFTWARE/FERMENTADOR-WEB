import { motion } from 'motion/react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../../../components/ui/badge'
import { CheckIcon } from 'lucide-react'
import Text3DFlip from '../../../../components/ui/text-3d-flip'

function FilledCheck({ color }: { color: string }) {
  return (
    <div className="rounded-full p-0.5 flex-shrink-0" style={{ backgroundColor: color }}>
      <CheckIcon className="size-3 text-black" strokeWidth={3} />
    </div>
  )
}

const REASONS = [
  {
    num:         '01',
    badge:       'EJE PEDAGÓGICO',
    stat:        'UNESCO',
    statLabel:   'BID · STEM 2022–2024',
    accent:      '#4ade80',
    description: 'El aprendizaje basado en datos reales incrementa la retención y la comprensión profunda de procesos bioquímicos continuos.',
    features: [
      'El estudiante no solo observa — experimenta',
      'Registra, predice e interpreta resultados reales',
      'Datos propios del proceso en tiempo real',
      'Incrementa retención y comprensión profunda',
    ],
  },
  {
    num:         '02',
    badge:       'EJE TECNOLÓGICO',
    stat:        '5',
    statLabel:   'Variables IoT en tiempo real',
    accent:      '#60a5fa',
    description: 'ML y NLP aplicados sobre datos propios del proceso con servicios en la nube — privacidad y cumplimiento normativo garantizados.',
    features: [
      'pH, temperatura, alcohol, turbidez, conductividad',
      'Privacidad y cumplimiento normativo garantizados',
      'Servicios en la nube escalables',
    ],
  },
  {
    num:         '03',
    badge:       'EJE ECONÓMICO',
    stat:        '<$1K',
    statLabel:   'Hardware USD accesible',
    accent:      '#a78bfa',
    description: 'El modelo HaaS + SaaS distribuye el costo entre hardware inicial y suscripción, haciéndolo accesible para instituciones que no pueden invertir en soluciones industriales de $15,000 USD o más.',
    features: [
      'Hardware inicial accesible para instituciones',
      'Suscripción SaaS de bajo costo',
      'Alternativa a soluciones industriales de $15K+',
    ],
  },
  {
    num:         '04',
    badge:       'EJE DE IMPACTO',
    stat:        'Red',
    statLabel:   'Efecto ML colaborativo',
    accent:      '#fb923c',
    description: 'Cada institución que adopta el sistema genera datos reales de fermentación que alimentan y mejoran los modelos de ML.',
    features: [
      'Datos reales alimentan modelos de ML compartidos',
      'Efecto de red que beneficia a todos los usuarios',
      'Mejora continua de modelos con cada institución',
    ],
  },
]

function FeaturedCard({ item }: { item: typeof REASONS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        'relative w-full overflow-hidden rounded-xl border border-white/8',
        'lg:col-span-5',
      )}
      style={{ background: `radial-gradient(circle 320px at 100% 0%, ${item.accent}22, #0c0d0d)` }}
    >
      {/* glow top-right */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-56 h-40 opacity-20 rounded-full"
        style={{ background: item.accent, filter: 'blur(40px)' }}
      />

      <div className="relative z-10 flex items-center gap-3 p-5 border-b border-white/5">
        <Badge
          variant="outline"
          className="border-white/10 text-white/60 text-[10px] tracking-widest"
        >
          {item.badge}
        </Badge>
        <span className="ml-auto font-mono text-[11px] font-black" style={{ color: `${item.accent}60` }}>
          {item.num}
        </span>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row p-5 gap-5">
        <div className="lg:w-[35%] flex flex-col gap-1">
          <span
            className="font-mono text-5xl font-semibold tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${item.accent} 0%, #ffffff 60%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {item.stat}
          </span>
          <span className="text-white/40 text-xs uppercase tracking-widest">{item.statLabel}</span>
          <p className="text-white/50 text-xs leading-relaxed mt-3">{item.description}</p>
        </div>

        <ul className="flex flex-col gap-3.5 lg:w-[65%]">
          {item.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/60">
              <FilledCheck color={item.accent} />
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function SmallCard({ item, className, delay = 0 }: { item: typeof REASONS[0]; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-white/8',
        className,
      )}
      style={{ background: `radial-gradient(circle 220px at 100% 0%, ${item.accent}18, #0c0d0d)` }}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-40 h-32 opacity-15 rounded-full"
        style={{ background: item.accent, filter: 'blur(32px)' }}
      />

      <div className="relative z-10 flex items-center gap-3 p-4 border-b border-white/5">
        <Badge
          variant="outline"
          className="border-white/10 text-white/60 text-[10px] tracking-widest"
        >
          {item.badge}
        </Badge>
        <span className="ml-auto font-mono text-[10px] font-black" style={{ color: `${item.accent}60` }}>
          {item.num}
        </span>
      </div>

      <div className="relative z-10 flex items-end gap-2 px-4 py-3">
        <span
          className="font-mono text-4xl font-semibold tracking-tight"
          style={{
            background: `linear-gradient(135deg, ${item.accent} 0%, #ffffff 60%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {item.stat}
        </span>
        <span className="text-white/40 text-xs mb-1">{item.statLabel}</span>
      </div>

      <ul className="relative z-10 flex flex-col gap-3 px-4 pb-5 text-sm text-white/55">
        {item.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <FilledCheck color={item.accent} />
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

const Justification = () => (
  <section
    className="relative w-full overflow-hidden"
    style={{ background: 'radial-gradient(35% 80% at 50% 0%, rgba(255,255,255,0.10) 0%, transparent 100%), #0A0A0B' }}
  >
    {/* dots grid */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
        backgroundSize:  '12px 12px',
      }}
    />

    {/* blur orbs */}
    <div aria-hidden className="absolute inset-0 isolate -z-10 opacity-80 contain-strict">
      <div
        className="absolute top-0 left-0 -translate-y-[350px] -rotate-45 rounded-full"
        style={{
          height: '80rem', width: '35rem',
          background: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(255,255,255,0.06) 0, rgba(140,140,140,0.02) 50%, rgba(255,255,255,0.01) 80%)',
        }}
      />
      <div
        className="absolute top-0 left-0 -rotate-45 rounded-full"
        style={{
          height: '80rem', width: '15rem',
          translate: '5% -50%',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.01) 80%, transparent 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 -translate-y-[350px] -rotate-45 rounded-full"
        style={{
          height: '80rem', width: '15rem',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.01) 80%, transparent 100%)',
        }}
      />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-16">

      {/* heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">Relevancia</span>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter">
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: 'spring', damping: 25, stiffness: 160 }}
            >
              Justificación
            </Text3DFlip>
          </h2>
          <div className="w-12 h-1 rounded-full bg-green-500/40 mt-1" />
        </motion.div>
        <motion.p
          className="max-w-sm text-neutral-500 text-sm leading-relaxed md:text-right"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Necesidad documentada por UNESCO y BID en sus reportes de educación STEM para Latinoamérica (2022–2024). Nich-Ká responde en cuatro ejes.
        </motion.p>
      </div>

      {/* bento grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8">
        <FeaturedCard item={REASONS[0]} />
        <SmallCard item={REASONS[1]} className="lg:col-span-3" delay={0.1} />
        <SmallCard item={REASONS[2]} className="lg:col-span-4" delay={0.15} />
        <SmallCard item={REASONS[3]} className="lg:col-span-4" delay={0.2} />
      </div>

    </div>
  </section>
)

export default Justification