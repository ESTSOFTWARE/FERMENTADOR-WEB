import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactLenis } from "lenis/react"
import { motion } from "motion/react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactChat from "../components/ContactChat"
import { cn } from "../../../../lib/utils"

const PLANES = [
  {
    num: "01", nombre: "Starter", precio: "$49", periodo: "USD / mes", color: "#4ade80",
    desc: "Para instituciones que inician su laboratorio de fermentación con un solo equipo.",
    items: [
      "1 kit activo",
      "1 fermentador activo",
      "Hasta 5 docentes",
      "Estudiantes ilimitados",
      "Reportes PDF automáticos",
      "NLP básico (análisis narrativo)",
      "Predicción ML de eficiencia",
      "Soporte estándar",
    ],
    off: [
      "NLP avanzado + notificaciones LLM",
      "Algoritmo genético",
      "Simulador pedagógico completo",
    ],
  },
  {
    num: "02", nombre: "Academic", precio: "$129", periodo: "USD / mes", color: "#a78bfa", destacado: true,
    desc: "Para instituciones con múltiples equipos, docentes y currículo de fermentación estructurado.",
    items: [
      "Hasta 5 kits activos",
      "Hasta 5 fermentadores simultáneos",
      "Docentes ilimitados",
      "Estudiantes ilimitados",
      "NLP avanzado + notificaciones push LLM",
      "Algoritmo genético de optimización",
      "Simulador pedagógico completo",
      "Detección de anomalías en tiempo real",
      "Reportes PDF + vista narrativa",
      "Soporte prioritario",
    ],
    off: [],
  },
]

const PlanesView = () => {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
        <div className="min-h-screen bg-[#0A0A0B] text-white">
          <Header />

          {/* ── Hero ── */}
          <section className="relative pt-40 pb-20 px-6 overflow-hidden">
            <div className={cn("pointer-events-none absolute inset-0 select-none bg-[size:40px_40px]",
              "bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]")} />
            <div className="pointer-events-none absolute inset-0 bg-radial-[ellipse_80%_40%_at_50%_0%] from-green-500/6 to-transparent" />
            <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors self-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Volver al inicio
              </Link>
              <span className="inline-block self-center text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">Plataforma en la nube</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
                Suscripción SaaS
              </h1>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xl mx-auto">
                Acceso a la plataforma con monitoreo IoT, ML, NLP y gestión multirol. Dos planes adaptados al tamaño y necesidades de tu institución educativa.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-6"><div className="h-px w-full bg-white/10" /></div>

          {/* ── Cuerpo ── */}
          <main className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-16">

            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">01</span>
                <h2 className="text-lg font-semibold text-white">Planes disponibles</h2>
              </div>
              <div className="pl-10 border-l border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start max-w-4xl">
                  {PLANES.map((plan, i) => (
                    <motion.div key={plan.num}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.12, type: "spring", stiffness: 80, damping: 18 }}
                      className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-7 flex flex-col gap-5"
                      style={plan.destacado ? { borderColor: `${plan.color}40`, background: `radial-gradient(circle at 80% 0%, ${plan.color}08, #171717)` } : {}}>
                      {plan.destacado && (
                        <>
                          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(to right, transparent, ${plan.color}70, transparent)` }} />
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="text-[11px] font-bold px-3 py-1 rounded-full text-white" style={{ background: plan.color }}>Recomendado</span>
                          </div>
                        </>
                      )}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: plan.color, background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}>{plan.nombre}</span>
                          <span className="text-[10px] font-mono text-neutral-600">{plan.num}</span>
                        </div>
                        <div className="flex items-end gap-1.5">
                          <span className="text-4xl font-black text-white leading-none">{plan.precio}</span>
                          <span className="text-sm text-neutral-500 mb-0.5">{plan.periodo}</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed">{plan.desc}</p>
                      </div>
                      <div className="h-px bg-neutral-800" />
                      <ul className="flex flex-col gap-2.5 flex-1">
                        {plan.items.map(item => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-300">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: plan.color }}><path d="M20 6L9 17l-5-5"/></svg>
                            {item}
                          </li>
                        ))}
                        {plan.off.map(item => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button onClick={() => setChatOpen(true)}
                        className="mt-auto text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
                        style={plan.destacado ? { background: plan.color, color: "#0A0A0B" } : { background: `${plan.color}15`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                        Solicitar plan
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">02</span>
                <h2 className="text-lg font-semibold text-white">Requisito de hardware</h2>
              </div>
              <div className="pl-10 border-l border-white/5">
                <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
                  Todos los planes SaaS requieren el kit de hardware Nich-Ká (<span className="text-neutral-300 font-medium">$600–$900 USD</span>, venta única). El kit incluye fermentador + 5 sensores + módulo IoT + actuadores. El Admin lo activa con el código único incluido en la compra.
                </p>
              </div>
            </section>

          </main>

          {/* ── CTA ── */}
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <div className="rounded-2xl border border-white/10 bg-white/3 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">¿Tienes dudas sobre qué plan elegir?</p>
                <p className="text-xs text-neutral-500 mt-0.5">Hablamos contigo y encontramos el plan que se ajusta al tamaño y currículo de tu institución.</p>
              </div>
              <button onClick={() => setChatOpen(true)} className="shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors">
                Contáctanos
              </button>
            </div>
          </div>

          <Footer />
        </div>
      </ReactLenis>
      <ContactChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}

export default PlanesView
