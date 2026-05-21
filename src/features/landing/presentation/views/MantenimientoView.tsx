import { useState } from "react"
import { Link } from "react-router-dom"
import { ReactLenis } from "lenis/react"
import { motion } from "motion/react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactChat from "../components/ContactChat"
import { cn } from "../../../../lib/utils"

const REPUESTOS = [
  { nombre: "Sensor de temperatura",  color: "#f59e0b", desc: "Reemplazo de sonda con calibración incluida. Garantía de 6 meses en el repuesto." },
  { nombre: "Sensor de pH",           color: "#f472b6", desc: "Sustitución de electrodo + soluciones de calibración certificadas." },
  { nombre: "Sensor de alcohol",      color: "#4ade80", desc: "Reemplazo de celda electroquímica y verificación con muestra real." },
  { nombre: "Sensor de conductividad",color: "#60a5fa", desc: "Reemplazo de sonda y ajuste de constante de celda para tu fermentador." },
  { nombre: "Sensor de turbidez",     color: "#a78bfa", desc: "Limpieza del módulo óptico o reemplazo completo según el nivel de daño." },
  { nombre: "Sensor de RPM",          color: "#34d399", desc: "Verificación y reemplazo de encoder de velocidad del agitador." },
  { nombre: "Motor de agitación",     color: "#0ea5e9", desc: "Diagnóstico, lubricación, reparación o sustitución completa del motor." },
  { nombre: "Módulo IoT ESP32",       color: "#38bdf8", desc: "Reflash de firmware actualizado o sustitución del módulo de conectividad." },
]

const PROCESO = [
  { num: "01", titulo: "Reporta el problema",  desc: "Contáctanos por la plataforma, WhatsApp o correo con el componente con falla." },
  { num: "02", titulo: "Diagnóstico remoto",   desc: "Analizamos los datos históricos para identificar el origen del problema sin necesidad de visita." },
  { num: "03", titulo: "Servicio en sitio",    desc: "Un técnico lleva el repuesto y realiza el reemplazo directamente en tu fermentador." },
  { num: "04", titulo: "Verificación",         desc: "Calibramos el componente nuevo y confirmamos que la plataforma recibe datos correctamente." },
]

const MantenimientoView = () => {
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
              <span className="inline-block self-center text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">Soporte técnico</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
                Mantenimiento y repuestos
              </h1>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-xl mx-auto">
                Un sensor dañado puede arruinar una fermentación completa. Reemplazamos y reparamos cualquier componente del kit para que no pierdas ningún lote.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-7xl px-6"><div className="h-px w-full bg-white/10" /></div>

          {/* ── Cuerpo ── */}
          <main className="mx-auto max-w-7xl px-6 py-16 flex flex-col gap-16">

            {/* Repuestos */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">01</span>
                <h2 className="text-lg font-semibold text-white">¿Qué componentes atendemos?</h2>
              </div>
              <div className="pl-10 border-l border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {REPUESTOS.map((r, i) => (
                    <motion.div key={r.nombre}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06, type: "spring", stiffness: 80, damping: 18 }}
                      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-neutral-700 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                      <p className="text-white font-semibold text-sm">{r.nombre}</p>
                      <p className="text-neutral-500 text-xs leading-relaxed">{r.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Proceso */}
            <section className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-green-500 shrink-0">02</span>
                <h2 className="text-lg font-semibold text-white">¿Cómo funciona el servicio?</h2>
              </div>
              <div className="pl-10 border-l border-white/5 flex flex-col gap-0">
                {PROCESO.map((p, i) => (
                  <motion.div key={p.num}
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 80, damping: 18 }}
                    className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-500 text-[11px] font-bold">{p.num}</span>
                      </div>
                      {i < PROCESO.length - 1 && <div className="w-px flex-1 bg-neutral-800 my-1.5" />}
                    </div>
                    <div className="pb-7">
                      <p className="text-white font-semibold text-sm mb-1">{p.titulo}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{p.desc}</p>
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
                <p className="text-sm font-semibold text-white">¿Tienes un componente con falla?</p>
                <p className="text-xs text-neutral-500 mt-0.5">Contáctanos y lo resolvemos para que tu fermentación no se detenga.</p>
              </div>
              <button onClick={() => setChatOpen(true)} className="shrink-0 text-sm font-medium px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors">
                Solicitar servicio
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

export default MantenimientoView
