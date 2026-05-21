import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactLenis } from "lenis/react"
import { motion } from "motion/react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactChat from "../components/ContactChat"
import { cn } from "../../../../lib/utils"

const COMPONENTES = [
  { nombre: "Fermentador biorreactor",   color: "#f59e0b", desc: "Tanque de acero inoxidable con tapa hermética, válvula de aireación y sistema de agitación integrado.", icon: "M9 3h6M9 3v6l-4 10h14l-4-10V3" },
  { nombre: "Sensor de temperatura",     color: "#f472b6", desc: "Sonda de precisión ±0.1°C. Rango operativo de 0°C a 80°C. Resistente a líquidos ácidos.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { nombre: "Sensor de pH",              color: "#60a5fa", desc: "Electrodo de vidrio con compensación de temperatura automática. Rango 0–14 pH.", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { nombre: "Sensor de alcohol",         color: "#4ade80", desc: "Medición de concentración etanólica en tiempo real mediante electroquímica de alta sensibilidad.", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" },
  { nombre: "Sensor de conductividad",   color: "#a78bfa", desc: "Monitoreo de actividad microbiana mediante conductividad eléctrica del medio de fermentación.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { nombre: "Sensor de turbidez",        color: "#fb923c", desc: "Medición óptica del crecimiento celular y claridad del líquido durante el proceso.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  { nombre: "Control de RPM",            color: "#34d399", desc: "Control de velocidad de agitación del motor para mantener la homogeneidad del cultivo.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  { nombre: "Módulos IoT ESP32 (×2)",    color: "#38bdf8", desc: "Dos microcontroladores con WiFi y Bluetooth. Puente entre los sensores físicos y la plataforma en la nube.", icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" },
]

const MODALIDADES = [
  {
    tipo: "Venta directa", color: "#f59e0b",
    desc: "Adquiere el kit completo con pago único. El hardware es tuyo desde el primer día.",
    items: ["Kit físico completo", "Instalación y configuración inicial", "Garantía de 1 año en sensores", "Acceso de por vida al firmware"],
  },
  {
    tipo: "Arrendamiento", color: "#4ade80",
    desc: "Accede al kit con renta mensual accesible. Sin inversión inicial elevada.",
    items: ["Kit físico completo", "Instalación incluida", "Reemplazo de sensores sin costo", "Soporte técnico incluido"],
  },
]

const HardwareView = () => {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
        <div className="min-h-screen bg-[#0A0A0B] text-white">
          <Header />

          {/* ── Hero (igual a LegalLayout) ── */}
          <section className="relative pt-40 pb-20 px-6 overflow-hidden">
            <div className={cn("pointer-events-none absolute inset-0 select-none bg-[size:40px_40px]",
              "bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)]")} />
            <div className="pointer-events-none absolute inset-0 bg-radial-[ellipse_80%_40%_at_50%_0%] from-green-500/6 to-transparent" />
            <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col gap-4">
              <Link to="/" className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors self-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Volver al inicio
              </Link>
              <span className="inline-block self-center text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">Infraestructura física</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
                Hardware como servicio
              </h1>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xl mx-auto">
                Kit completo de fermentación inteligente: fermentador, seis sensores de precisión, control de RPM y dos módulos IoT. Diseñado para el pequeño productor, instalado y listo en horas.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-6"><div className="h-px w-full bg-white/10" /></div>

          {/* ── Cuerpo ── */}
          <main className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-16">

            {/* Componentes */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">01</span>
                <h2 className="text-lg font-semibold text-white">¿Qué incluye el kit?</h2>
              </div>
              <div className="pl-10 border-l border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {COMPONENTES.map((c, i) => (
                    <motion.div key={c.nombre}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 80, damping: 18 }}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-neutral-700 transition-colors">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: c.color }}>
                          <path d={c.icon} />
                        </svg>
                      </div>
                      <p className="text-white font-semibold text-sm">{c.nombre}</p>
                      <p className="text-neutral-500 text-xs leading-relaxed">{c.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Modalidades */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">02</span>
                <h2 className="text-lg font-semibold text-white">Modalidades de acceso</h2>
              </div>
              <div className="pl-10 border-l border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {MODALIDADES.map((m, i) => (
                    <motion.div key={m.tipo}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 80, damping: 18 }}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-7 flex flex-col gap-5">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: m.color, background: `${m.color}15`, border: `1px solid ${m.color}30` }}>{m.tipo}</span>
                        <p className="mt-4 text-neutral-400 text-sm leading-relaxed">{m.desc}</p>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {m.items.map(item => (
                          <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-300">
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: m.color }}><path d="M20 6L9 17l-5-5"/></svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

          </main>

          {/* ── CTA (igual a LegalLayout) ── */}
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <div className="rounded-2xl border border-white/10 bg-white/3 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">¿Listo para empezar?</p>
                <p className="text-xs text-neutral-500 mt-0.5">Contáctanos y te asesoramos sobre la modalidad que mejor se ajusta a tu producción.</p>
              </div>
              <button onClick={() => setChatOpen(true)} className="shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors">
                Solicitar información
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

export default HardwareView
