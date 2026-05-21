import { motion } from "motion/react"
import { Activity, Cpu, Globe, FlaskConical, Database } from "lucide-react"
import { HexagonBackground } from "../../../../components/animate-ui/components/backgrounds/hexagon"
import { GlowingEffect } from "../../../../components/ui/glowing-effect"
import { RadialNav } from "../../../../components/animate-ui/components/community/radial-nav"

const NAV_ITEMS = [
  { id: 1, icon: Activity,     label: "IoT",        angle: 0    },
  { id: 2, icon: Cpu,          label: "ML",         angle: 72   },
  { id: 3, icon: Globe,        label: "NLP",        angle: 144  },
  { id: 4, icon: FlaskConical, label: "Plataforma", angle: -144 },
  { id: 5, icon: Database,     label: "Negocio",    angle: -72  },
]

const SPECIFIC: { num: string; title: string; text: string; tag: string; icon: React.ReactNode }[] = [
  {
    num: "01", tag: "IoT",
    title: "Adquisición en tiempo real",
    text: "Implementar adquisición continua de datos (pH, temperatura, alcohol, turbidez, conductividad) con transmisión mediante RabbitMQ y control remoto de actuadores (bomba y motor a pasos).",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    num: "02", tag: "ML",
    title: "Predicción de eficiencia",
    text: "Entrenar un modelo de regresión supervisado capaz de predecir la eficiencia final de una fermentación a partir de lecturas de la primera mitad del proceso, con métricas documentadas.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    num: "03", tag: "ML",
    title: "Detección de anomalías",
    text: "Implementar Isolation Forest o Autoencoder ligero para detectar lecturas fuera del comportamiento histórico normal y disparar alertas en tiempo real durante el proceso.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  {
    num: "04", tag: "NLP",
    title: "Reportes en lenguaje natural",
    text: "Desarrollar un módulo que, al finalizar cada fermentación, produzca un párrafo de análisis interpretativo en español basado en los datos reales del proceso, sin APIs de IA externas.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    num: "05", tag: "NLP",
    title: "Notificaciones inteligentes",
    text: "Integrar un LLM local (vía ngrok u hospedaje propio) que analice lecturas periódicas de sensores y genere recomendaciones accionables como notificaciones push en la app móvil.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  },
  {
    num: "06", tag: "Plataforma",
    title: "Sistema multirol",
    text: "Consolidar la plataforma web y app móvil con gestión de roles Admin → Docente → Estudiante, sistema de reportes descargables y simulador pedagógico de fermentación.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    num: "07", tag: "Negocio",
    title: "Validación HaaS + SaaS",
    text: "Validar el modelo HaaS + SaaS con al menos una institución piloto, documentando métricas de adopción, satisfacción docente y mejora en el desempeño académico de los estudiantes.",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
]

interface BentoItemProps {
  area: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const BentoItem = ({ area, children, className = "", delay = 0 }: BentoItemProps) => (
  <motion.li
    className={`list-none ${area} ${className}`}
    initial={{ opacity: 0, y: 28, scale: 0.97 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ type: "spring", stiffness: 70, damping: 18, delay }}
  >
    <div className="relative h-full rounded-2xl border border-black p-2">
      <GlowingEffect spread={40} glow={false} proximity={64} inactiveZone={0.01} disabled={false} />
      <div className="relative flex h-full flex-col gap-5 overflow-hidden rounded-xl p-6 bg-black" style={{ boxShadow: "0px 0px 27px 0px #1a1a1a" }}>
        {children}
      </div>
    </div>
  </motion.li>
)

const ObjCardInner = ({ item }: { item: typeof SPECIFIC[0] }) => (
  <>
    <div className="flex items-start justify-between">
      <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
        {item.icon}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold text-white/40" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {item.tag}
        </span>
        <span className="text-[10px] font-black font-mono text-white/25">{item.num}</span>
      </div>
    </div>
    <div className="flex flex-col gap-1.5 flex-1 justify-end">
      <h3 className="text-white font-semibold text-base leading-tight">{item.title}</h3>
      <p className="text-neutral-400 text-xs leading-relaxed">{item.text}</p>
    </div>
  </>
)

const Objectives = () => (
  <section className="relative w-full overflow-hidden" style={{ background: "#0F8E4D" }}>
    <HexagonBackground
      className="absolute inset-0 z-0 !bg-transparent"
      hexagonSize={70}
      hexagonMargin={2}
      hexagonProps={{
        className: "before:!bg-[rgba(255,255,255,0.06)] after:!bg-[rgba(15,142,77,1)] hover:before:!bg-[rgba(255,255,255,0.14)] hover:after:!bg-[rgba(255,255,255,0.04)]"
      }}
    />
    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-16">

      <div className="flex items-center justify-between gap-8">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">Metas</span>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">Objetivos</h2>
          <div className="w-12 h-1 rounded-full bg-white/40" />
        </motion.div>

        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <RadialNav items={NAV_ITEMS} size={140} defaultActiveId={1} menuButtonConfig={{ iconSize: 14, buttonSize: 30, buttonPadding: 6 }} />
        </motion.div>
      </div>

      <motion.ul
        className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {/* Objetivo General — tall left card, spans 3 rows */}
        <BentoItem area="md:[grid-area:1/1/4/5]" className="min-h-[14rem]" delay={0}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50">Objetivo general</span>
          </div>

          <p className="text-white font-bold text-base leading-snug tracking-tight flex-1">
            Desarrollar un sistema integral de monitoreo y análisis inteligente de procesos fermentativos orientado a la enseñanza experimental de biotecnología, integrando IoT, Machine Learning propio y NLP sin dependencia de APIs externas de IA.
          </p>

          <div className="flex gap-2 flex-wrap">
            {["IoT", "ML propio", "NLP local", "Multi-rol"].map(label => (
              <span key={label} className="text-[10px] px-2.5 py-1 rounded-full font-semibold text-white/80" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                {label}
              </span>
            ))}
          </div>
        </BentoItem>

        {/* Obj 01 — IoT */}
        <BentoItem area="md:[grid-area:1/5/2/9]" className="min-h-[12rem]" delay={0.1}>
          <ObjCardInner item={SPECIFIC[0]} />
        </BentoItem>

        {/* Obj 02 — ML predicción */}
        <BentoItem area="md:[grid-area:1/9/2/13]" className="min-h-[12rem]" delay={0.15}>
          <ObjCardInner item={SPECIFIC[1]} />
        </BentoItem>

        {/* Obj 03 — ML anomalías */}
        <BentoItem area="md:[grid-area:2/5/3/9]" className="min-h-[12rem]" delay={0.2}>
          <ObjCardInner item={SPECIFIC[2]} />
        </BentoItem>

        {/* Obj 04 — NLP reportes */}
        <BentoItem area="md:[grid-area:2/9/3/13]" className="min-h-[12rem]" delay={0.25}>
          <ObjCardInner item={SPECIFIC[3]} />
        </BentoItem>

        {/* Obj 05 — NLP notificaciones */}
        <BentoItem area="md:[grid-area:3/5/4/9]" className="min-h-[12rem]" delay={0.3}>
          <ObjCardInner item={SPECIFIC[4]} />
        </BentoItem>

        {/* Obj 06 — Plataforma multirol */}
        <BentoItem area="md:[grid-area:3/9/4/13]" className="min-h-[12rem]" delay={0.35}>
          <ObjCardInner item={SPECIFIC[5]} />
        </BentoItem>

        {/* Obj 07 — Modelo de negocio — full width bottom */}
        <BentoItem area="md:[grid-area:4/1/5/13]" className="min-h-[10rem]" delay={0.4}>
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
              {SPECIFIC[6].icon}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold text-white/40" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {SPECIFIC[6].tag}
              </span>
              <span className="text-[10px] font-black font-mono text-white/25">{SPECIFIC[6].num}</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 flex-1">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-white font-semibold text-base leading-tight">{SPECIFIC[6].title}</h3>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl">{SPECIFIC[6].text}</p>
            </div>
          </div>
        </BentoItem>

      </motion.ul>
    </div>
  </section>
)

export default Objectives
