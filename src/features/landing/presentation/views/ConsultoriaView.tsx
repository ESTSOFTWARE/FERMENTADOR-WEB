import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactLenis } from "lenis/react"
import { motion } from "motion/react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactChat from "../components/ContactChat"
import { cn } from "../../../../lib/utils"

const SERVICIOS = [
  { titulo: "Instalación y configuración", color: "#10b981", desc: "Instalamos el kit físico, conectamos los sensores y verificamos que la plataforma recibe datos correctamente antes de retirarnos.", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { titulo: "Calibración de sensores",    color: "#34d399", desc: "Calibramos los 7 sensores con soluciones de referencia certificadas. pH, temperatura, conductividad y alcohol ajustados a tu proceso.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { titulo: "Capacitación del equipo",    color: "#6ee7b7", desc: "Formación práctica para el productor y su equipo: interpretación de gráficas, uso del algoritmo genético y lectura de reportes de eficiencia.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { titulo: "Acompañamiento posterior",   color: "#a7f3d0", desc: "Seguimiento durante las primeras 4 fermentaciones. Ajustamos parámetros y resolvemos dudas en tiempo real para garantizar los mejores resultados.", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
]

const PASOS = [
  { num: "01", titulo: "Contacto inicial",  desc: "Nos cuentas tu proceso, volumen de producción y necesidades específicas." },
  { num: "02", titulo: "Visita técnica",    desc: "Un especialista evalúa tu instalación y planifica la configuración óptima." },
  { num: "03", titulo: "Instalación",       desc: "Montamos el kit, calibramos los sensores y verificamos la conexión con la plataforma." },
  { num: "04", titulo: "Capacitación",      desc: "Formamos a tu equipo en el uso de la plataforma e interpretación de datos." },
  { num: "05", titulo: "Seguimiento",       desc: "Acompañamiento en las primeras sesiones para garantizar resultados óptimos." },
]

const ConsultoriaView = () => {
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
              <span className="inline-block self-center text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">Formación especializada</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
                Consultoría y capacitación
              </h1>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xl mx-auto">
                No solo instalamos el sistema, te acompañamos hasta que tu equipo domina la herramienta y tu fermentación mejora de manera medible.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-6"><div className="h-px w-full bg-white/10" /></div>

          {/* ── Cuerpo ── */}
          <main className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-16">

            {/* Servicios */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">01</span>
                <h2 className="text-lg font-semibold text-white">¿Qué incluye?</h2>
              </div>
              <div className="pl-10 border-l border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {SERVICIOS.map((s, i) => (
                    <motion.div key={s.titulo}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 18 }}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex gap-5 hover:border-neutral-700 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15` }}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: s.color }}>
                          <path d={s.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-1.5">{s.titulo}</p>
                        <p className="text-neutral-500 text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Proceso */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">02</span>
                <h2 className="text-lg font-semibold text-white">Proceso de onboarding</h2>
              </div>
              <div className="pl-10 border-l border-white/5 flex flex-col gap-0">
                {PASOS.map((paso, i) => (
                  <motion.div key={paso.num}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 18 }}
                    className="flex gap-5 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-500 text-[11px] font-bold">{paso.num}</span>
                      </div>
                      {i < PASOS.length - 1 && <div className="w-px flex-1 bg-neutral-800 my-1.5" />}
                    </div>
                    <div className="pb-7">
                      <p className="text-white font-semibold text-sm mb-1">{paso.titulo}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{paso.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

          </main>

          {/* ── CTA ── */}
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <div className="rounded-2xl border border-white/10 bg-white/3 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">¿Listo para el onboarding?</p>
                <p className="text-xs text-neutral-500 mt-0.5">Agenda una llamada y definimos el plan de implementación para tu producción.</p>
              </div>
              <button onClick={() => setChatOpen(true)} className="shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors">
                Agendar llamada
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

export default ConsultoriaView
