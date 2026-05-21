import { motion, type Variants } from "motion/react"
import { DottedSurface } from "@/components/ui/dotted-surface"
import { GradientCard } from "@/components/ui/gradient-card"

const REVENUE = [
  {
    badgeText: "Infraestructura física",
    badgeColor: "#f59e0b",
    title: "Hardware como servicio",
    description: "Kit físico: fermentador + 5 sensores + módulo IoT + actuadores. Precio estimado $600–$900 USD. El Admin activa el equipo con código único incluido.",
    ctaText: "Ver hardware",
    ctaHref: "/hardware",
    gradient: "orange" as const,
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="28" y="28" width="44" height="44" rx="6" fill="#00979C"/>
        <rect x="36" y="36" width="28" height="28" rx="3" fill="#e0f7fa"/>
        <rect x="42" y="42" width="7" height="7" rx="1" fill="#00979C"/>
        <rect x="52" y="42" width="7" height="7" rx="1" fill="#00BCD4"/>
        <rect x="42" y="52" width="7" height="7" rx="1" fill="#00BCD4"/>
        <rect x="52" y="52" width="7" height="7" rx="1" fill="#00979C"/>
        <rect x="38" y="20" width="4" height="8" rx="2" fill="#4DD0E1"/>
        <rect x="48" y="20" width="4" height="8" rx="2" fill="#4DD0E1"/>
        <rect x="58" y="20" width="4" height="8" rx="2" fill="#4DD0E1"/>
        <rect x="38" y="72" width="4" height="8" rx="2" fill="#4DD0E1"/>
        <rect x="48" y="72" width="4" height="8" rx="2" fill="#4DD0E1"/>
        <rect x="58" y="72" width="4" height="8" rx="2" fill="#4DD0E1"/>
        <rect x="20" y="38" width="8" height="4" rx="2" fill="#4DD0E1"/>
        <rect x="20" y="48" width="8" height="4" rx="2" fill="#4DD0E1"/>
        <rect x="20" y="58" width="8" height="4" rx="2" fill="#4DD0E1"/>
        <rect x="72" y="38" width="8" height="4" rx="2" fill="#4DD0E1"/>
        <rect x="72" y="48" width="8" height="4" rx="2" fill="#4DD0E1"/>
        <rect x="72" y="58" width="8" height="4" rx="2" fill="#4DD0E1"/>
      </svg>
    ),
  },
  {
    badgeText: "Plataforma en la nube",
    badgeColor: "#8b5cf6",
    title: "Suscripción SaaS",
    description: "Suscripción mensual o anual pagada por el Admin. Incluye docentes y estudiantes ilimitados, actualizaciones de modelos ML, soporte técnico y hosting del servidor de análisis.",
    ctaText: "Ver planes",
    ctaHref: "/planes",
    gradient: "purple" as const,
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M72 55a14 14 0 0 0-13-14 18 18 0 0 0-35 4 12 12 0 0 0 2 24h46a12 12 0 0 0 0-14z" fill="#4A90D9"/>
        <rect x="38" y="70" width="6" height="12" rx="2" fill="#2563EB"/>
        <rect x="47" y="65" width="6" height="17" rx="2" fill="#3B82F6"/>
        <rect x="56" y="60" width="6" height="22" rx="2" fill="#1D4ED8"/>
        <circle cx="45" cy="43" r="3" fill="#BFDBFE"/>
        <circle cx="57" cy="39" r="2" fill="#DBEAFE"/>
        <circle cx="38" cy="48" r="2" fill="#DBEAFE"/>
      </svg>
    ),
  },
  {
    badgeText: "Formación especializada",
    badgeColor: "#10b981",
    title: "Consultoría y capacitación",
    description: "Onboarding presencial o remoto: calibración de sensores, validación de parámetros locales, capacitación docente y personalización del simulador para el currículo de la institución.",
    ctaText: "Solicitar onboarding",
    ctaHref: "/consultoria",
    gradient: "green" as const,
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 38h36l-6 32a4 4 0 0 1-4 3H38a4 4 0 0 1-4-3z" fill="#6F3D1F"/>
        <path d="M30 38h32l-1 6H31z" fill="#92400E" opacity="0.4"/>
        <path d="M64 45h4a8 8 0 0 1 0 16h-4" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M40 30 Q42 24 40 18" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M50 30 Q52 22 50 16" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M60 30 Q62 24 60 18" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx="46" cy="73" rx="22" ry="4" fill="#92400E" opacity="0.35"/>
        <ellipse cx="43" cy="50" rx="7" ry="3" fill="#FDE68A" opacity="0.25"/>
      </svg>
    ),
  },
  {
    badgeText: "Soporte técnico",
    badgeColor: "#0ea5e9",
    title: "Mantenimiento y repuestos",
    description: "Reemplazo de sensores dañados, mantenimiento de motor y hardware, y revisión periódica del equipo. El sistema siempre operando, sin perder una fermentación.",
    ctaText: "Solicitar servicio",
    ctaHref: "/mantenimiento",
    gradient: "gray" as const,
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="18" fill="#0ea5e9" opacity="0.15"/>
        <circle cx="50" cy="50" r="10" fill="#0ea5e9" opacity="0.4"/>
        <circle cx="50" cy="50" r="5" fill="#38bdf8"/>
        <path d="M68 32 L58 42" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M64 28 L72 24 L76 36 L68 32Z" fill="#0ea5e9"/>
        <rect x="62" y="22" width="16" height="8" rx="3" fill="#0284c7" transform="rotate(-30 62 22)"/>
        <path d="M32 68 L42 58" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round"/>
        <path d="M24 72 L28 64 L36 68 L32 76Z" fill="#0369a1"/>
        <path d="M50 22 L50 30" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M50 70 L50 78" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M22 50 L30 50" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M70 50 L78 50" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const SEGMENTS = [
  { label: "Universidades",              sub: "Biotecnología e Ing. Química",  color: "#4ade80" },
  { label: "Tecnológicos",               sub: "Agroindustrial y Alimentos",     color: "#60a5fa" },
  { label: "Facultades especializadas",  sub: "Programas STEM con laboratorio", color: "#a78bfa" },
  { label: "Laboratorios de alimentos",  sub: "Centros de investigación",       color: "#fb923c" },
]


const revealVariants: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.93 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 75, damping: 18, delay: i * 0.14 },
  }),
}

const BusinessModel = () => (
  <section
    className="relative w-full overflow-hidden"
    style={{ background: "linear-gradient(to bottom, #0F8E4D 0%, #1a3d26 35%, #0d1a11 65%, #0A0A0B 100%)" }}
  >
    <DottedSurface particleColor="#4ade80" />
    <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

    <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,255,255,0.04), transparent)" }} />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-16">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: -32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-medium">Estrategia</span>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter">
            Propuesta de<br />modelo de negocio
          </h2>
          <div className="w-12 h-1 rounded-full bg-white/40" />
        </motion.div>
        <motion.p
          className="max-w-sm text-white/60 text-sm leading-relaxed md:text-right"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.1 }}
        >
          Modelo HaaS + SaaS diseñado para instituciones educativas con restricciones presupuestales y flujos pedagógicos específicos.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REVENUE.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="min-h-[280px]"
          >
            <GradientCard
              badgeText={card.badgeText}
              badgeColor={card.badgeColor}
              title={card.title}
              description={card.description}
              ctaText={card.ctaText}
              ctaHref={card.ctaHref}
              icon={card.icon}
              gradient={card.gradient}
            />
          </motion.div>
        ))}
      </div>

      {/* Segmentos */}
      <div className="flex flex-col gap-6">
        <motion.span
          className="text-xs uppercase tracking-wider font-medium text-white/40"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
        >
          Segmentos objetivo
        </motion.span>
        <div className="flex flex-wrap gap-3">
          {SEGMENTS.map(({ label, sub, color }, i) => (
            <motion.div
              key={label}
              className="flex flex-col gap-0.5 px-3 py-2 rounded-lg cursor-default"
              style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${color}30`, backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, borderColor: `${color}60`, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 16, delay: i * 0.08 }}
            >
              <span className="text-xs font-bold text-white">{label}</span>
              <span className="text-[11px] leading-tight" style={{ color: `${color}80` }}>{sub}</span>
            </motion.div>
          ))}
        </div>

        {/* Propuesta de valor */}
        <motion.div
          className="mt-2 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row items-start gap-8 relative overflow-hidden"
          style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(16px)" }}
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 65, damping: 18, delay: 0.15 }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }} />
          <div className="absolute -top-10 left-1/2 w-64 h-32 -translate-x-1/2 blur-3xl pointer-events-none" style={{ background: "rgba(15,142,77,0.12)" }} />

          <div className="flex-1 flex flex-col gap-3 relative z-10">
            <span className="text-xs uppercase tracking-wider text-white/40 font-medium">Propuesta de valor</span>
            <p className="text-white font-bold text-xl leading-snug">
              El único sistema de fermentación educativo con ML e NLP integrados, accesible económicamente, con modelo pedagógico multirol y sin dependencia de infraestructura cloud de terceros.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-1 relative z-10 md:pt-6">
            <motion.span
              className="text-5xl font-black text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.3 }}
            >
              B2B
            </motion.span>
            <span className="text-xs text-white/30 uppercase tracking-wider">institucional</span>
          </div>
        </motion.div>

        {/* Ventaja competitiva */}
        <motion.div
          className="p-7 rounded-2xl relative overflow-hidden"
          style={{ background: "rgba(15,142,77,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 65, damping: 18, delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-green-400/70">Ventaja competitiva sostenible</span>
              <p className="text-white/80 text-sm leading-relaxed">
                Cada institución suscrita genera datos reales de fermentación que reentrenan los modelos ML globales (con consentimiento y anonimización). Cuantas más instituciones usan el sistema, más precisos se vuelven los modelos —
                <span className="text-white font-semibold"> creando un foso competitivo basado en datos propios del dominio que ningún competidor puede replicar fácilmente.</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  </section>
)

export default BusinessModel
