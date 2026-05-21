import { motion, type Variants } from "motion/react"
import { HexagonPattern } from "../../../../components/ui/hexagon-pattern"
import { cn } from "../../../../lib/utils"

const PROBLEMS = [
  {
    num: "01",
    title: "Brecha instrumental",
    description: "Los laboratorios universitarios de biotecnología en Latinoamérica carecen de equipamiento accesible para monitoreo continuo. Los estudiantes aprenden fermentación con procedimientos manuales que imposibilitan la recopilación sistemática de datos.",
    color: "#fbbf24",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Aprendizaje desconectado",
    description: "Sin monitoreo en tiempo real, los estudiantes aprenden los principios de la fermentación de forma teórica o con observaciones puntuales, sin desarrollar la capacidad de interpretar dinámicas continuas del proceso.",
    color: "#06b6d4",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Soluciones inaccesibles",
    description: "Las soluciones comerciales instrumentadas (Eppendorf BioFlo, Sartorius BIOSTAT) superan los $15,000 USD. Los proyectos de código abierto como OpenFermentor proveen hardware accesible pero carecen de IA integrada y reportes automatizados.",
    color: "#f472b6",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.92, rotateX: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { type: "spring", stiffness: 90, damping: 18, delay: i * 0.18 },
  }),
}

const ProblemStatement = () => (
  <section className="relative w-full overflow-hidden" style={{ background: "#0F8E4D", perspective: "1200px" }}>

    <HexagonPattern
      hexagons={[[1,1],[4,4],[2,2],[3,4],[5,4],[8,2],[6,3],[8,5],[10,10],[12,3],[7,7],[3,8]]}
      className={cn(
        "absolute inset-0 z-0 [&_svg]:w-full [&_svg]:h-full",
        "mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
      )}
      radius={36}
    />

    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-16">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">Contexto</span>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
            Planteamiento<br />del problema
          </h2>
          <div className="w-12 h-1 rounded-full bg-white/40" />
        </motion.div>
        <motion.p
          className="max-w-sm text-white/70 text-sm leading-relaxed md:text-right"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
        >
          La enseñanza práctica de la fermentación enfrenta una brecha crítica: formación sin datos,
          sin monitoreo continuo y sin herramientas al alcance de las instituciones educativas.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ perspective: "1000px" }}>
        {PROBLEMS.map(({ num, title, description, icon, color }, i) => (
          <motion.div
            key={num}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex flex-col gap-6 p-8 rounded-2xl cursor-default border-2 border-dashed"
            style={{ borderColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "rgba(0,0,0,0.1)" }} />

            <div className="flex items-start justify-between relative">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.35)", border: `1px solid ${color}70`, color }}
              >
                {icon}
              </div>
              <span className="text-5xl font-black leading-none select-none" style={{ color: "rgba(0,0,0,0.2)" }}>{num}</span>
            </div>

            <div className="flex flex-col gap-2 relative">
              <h3 className="text-white font-black text-lg leading-tight tracking-tight">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Pregunta */}
        <motion.div
          className="relative flex flex-col justify-between gap-6 p-8 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.1 }}
        >
          <span
            className="pointer-events-none absolute -top-4 -right-2 text-[9rem] font-black leading-none select-none"
            style={{ color: "rgba(255,255,255,0.07)" }}
          >?</span>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <span className="text-xs uppercase tracking-[0.25em] text-white/50 font-semibold">Pregunta central</span>
          </div>

          <p className="text-white font-black text-xl md:text-2xl leading-snug tracking-tight">
            ¿Cómo cerrar la brecha entre la formación teórica en fermentación y la práctica instrumentada sin que el costo sea una barrera institucional?
          </p>

          <div className="flex gap-2 flex-wrap">
            {["Educación", "Instrumentación", "Accesibilidad"].map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white/60" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Respuesta */}
        <motion.div
          className="relative flex flex-col justify-between gap-6 p-8 rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.2 }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: "linear-gradient(to right, rgba(255,255,255,0.5), transparent)" }} />

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
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
            {["IoT", "ML propio", "NLP local", "Multi-rol", "<$1,000 USD"].map(t => (
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white/60" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}>{t}</span>
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  </section>
)

export default ProblemStatement
