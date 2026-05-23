import { motion, type Variants } from 'motion/react'
import { StarsBackground } from '../../../../components/animate-ui/components/backgrounds/stars'
import Text3DFlip from '../../../../components/ui/text-3d-flip'

const REASONS = [
  {
    num: "01",
    title: "Eje pedagógico",
    description: "El aprendizaje basado en datos reales incrementa la retención y la comprensión profunda de procesos bioquímicos continuos. El estudiante no solo observa — experimenta, registra, predice e interpreta.",
    accent: "#4ade80",
    stat: { value: "UNESCO", label: "BID · STEM 2022–2024" },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Eje tecnológico",
    description: "ML y NLP aplicados sobre datos propios del proceso (pH, temperatura, alcohol, turbidez, conductividad) con servicios en la nube — privacidad y cumplimiento normativo garantizados.",
    accent: "#60a5fa",
    stat: { value: "5", label: "variables IoT en tiempo real" },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Eje económico",
    description: "El modelo HaaS + SaaS distribuye el costo entre hardware inicial y suscripción, haciéndolo accesible para instituciones que no pueden invertir en soluciones industriales de $15,000 USD o más.",
    accent: "#a78bfa",
    stat: { value: "<$1K", label: "hardware USD accesible" },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Eje de impacto",
    description: "Cada institución que adopta el sistema genera datos reales de fermentación que alimentan y mejoran los modelos de ML, creando un efecto de red que beneficia a todos los usuarios de la plataforma.",
    accent: "#fb923c",
    stat: { value: "Red", label: "efecto ML colaborativo" },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
        <path d="M12 7v4M8.5 17.5l3-4.5M15.5 17.5l-3-4.5"/>
      </svg>
    ),
  },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 18, delay: i * 0.12 },
  }),
}

const JustifCard = ({ num, title, description, accent, stat, icon, index }: typeof REASONS[0] & { index: number }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="relative rounded-[10px] p-px"
    style={{ background: `radial-gradient(circle 230px at 100% 0%, ${accent}, #0c0d0d)` }}
  >
    {/* animated dot */}
    <div
      className="absolute w-[5px] aspect-square rounded-full z-[2]"
      style={{
        backgroundColor: accent,
        boxShadow: `0 0 10px ${accent}, 0 0 20px ${accent}80`,
        animation: 'moveDot 6s linear infinite',
        animationDelay: `${index * -1.5}s`,
      }}
    />

    {/* inner card */}
    <div
      className="relative w-full h-full rounded-[9px] border border-[#202222] overflow-hidden flex flex-col gap-5 p-7 text-white"
      style={{ background: `radial-gradient(circle 280px at 100% 0%, ${accent}28, #0c0d0d)` }}
    >
      {/* ray */}
      <div
        className="pointer-events-none absolute w-[220px] h-[45px] rounded-full top-0 right-0 opacity-30"
        style={{
          backgroundColor: accent,
          boxShadow: `0 0 50px ${accent}`,
          filter: 'blur(10px)',
          transformOrigin: '90%',
          transform: 'rotate(-40deg)',
        }}
      />

      {/* header */}
      <div className="flex items-start justify-between relative z-10">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accent}20`, border: `1px solid ${accent}50`, color: accent }}
        >
          {icon}
        </div>
        <span className="text-[11px] font-black font-mono" style={{ color: `${accent}55` }}>{num}</span>
      </div>

      {/* stat */}
      <div className="flex flex-col gap-1 relative z-10">
        <span
          className="text-5xl font-black leading-none"
          style={{
            background: `linear-gradient(45deg, ${accent}70 4%, #ffffff, ${accent}50)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {stat.value}
        </span>
        <span className="text-xs text-neutral-400 uppercase tracking-widest">{stat.label}</span>
      </div>

      {/* text */}
      <div className="flex flex-col gap-1.5 relative z-10 flex-1">
        <h3 className="text-white font-black text-base leading-tight tracking-tight">{title}</h3>
        <p className="text-neutral-500 text-xs leading-relaxed">{description}</p>
      </div>

      {/* decorative lines */}
      <div className="absolute top-[10%] left-0 right-0 h-px pointer-events-none" style={{ background: `linear-gradient(90deg, #1d1f1f 30%, ${accent}55 70%)` }} />
      <div className="absolute bottom-[10%] left-0 right-0 h-px bg-[#2c2c2c] pointer-events-none" />
      <div className="absolute left-[10%] top-0 bottom-0 w-px bg-[#2c2c2c] pointer-events-none" />
      <div className="absolute right-[10%] top-0 bottom-0 w-px pointer-events-none" style={{ background: `linear-gradient(180deg, ${accent}45 30%, #222424 70%)` }} />
    </div>
  </motion.div>
)

const Justification = () => (
  <section className="relative w-full overflow-hidden">
    <style>{`
      @keyframes moveDot {
        0%,  100% { top: 10%; right: 10%; }
        25%        { top: 10%; right: calc(100% - 35px); }
        50%        { top: calc(100% - 30px); right: calc(100% - 35px); }
        75%        { top: calc(100% - 30px); right: 10%; }
      }
    `}</style>

    <StarsBackground
      starColor="#fff"
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at bottom, #0d1a11 0%, #0A0A0B 100%)' }}
      pointerEvents={false}
    />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-16">

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
              transition={{ type: "spring", damping: 25, stiffness: 160 }}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REASONS.map((r, i) => (
          <JustifCard key={r.num} {...r} index={i} />
        ))}
      </div>

    </div>
  </section>
)

export default Justification
