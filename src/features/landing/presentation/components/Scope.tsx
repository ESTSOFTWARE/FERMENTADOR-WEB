import { motion } from "motion/react"
import {
  Activity, Radio, Clock, Zap, TrendingUp, AlertTriangle,
  FileText, MessageSquare, Bell, Smartphone, Users, Calculator, Table2,
  Database, Cpu, Coffee, Wifi, Pin,
} from "lucide-react"
import Text3DFlip from '../../../../components/ui/text-3d-flip'

const ALCANCES = [
  { icon: Activity,      name: "Monitoreo en tiempo real",             info: "5 sensores: pH, temperatura, alcohol, turbidez y conductividad" },
  { icon: Radio,         name: "Control remoto de actuadores",         info: "Bomba y motor a pasos desde la plataforma web" },
  { icon: Clock,         name: "Registro histórico completo",          info: "Inicio/fin de fermentación con trazabilidad por sesión" },
  { icon: Zap,           name: "Algoritmo genético",                   info: "Optimización experimental de parámetros de fermentación" },
  { icon: TrendingUp,    name: "ML — predicción de eficiencia",        info: "Modelo supervisado que predice el resultado desde la mitad del proceso" },
  { icon: AlertTriangle, name: "ML — detección de anomalías",          info: "Isolation Forest / Autoencoder en tiempo real con alertas" },
  { icon: FileText,      name: "Reportes PDF automáticos",             info: "Generados al finalizar cada fermentación" },
  { icon: MessageSquare, name: "NLP — análisis narrativo",             info: "Párrafo interpretativo post-fermentación sin APIs externas" },
  { icon: Bell,          name: "Notificaciones push con LLM",          info: "Recomendaciones accionables basadas en lecturas de sensores" },
  { icon: Smartphone,    name: "App móvil con simulador",              info: "Para estudiantes con modo simulador pedagógico" },
  { icon: Users,         name: "Gestión multirol",                     info: "Admin → Docente → Estudiante con permisos diferenciados" },
  { icon: Calculator,    name: "Calculadora de eficiencia",            info: "Fórmula Gay-Lussac validada con parámetros reales" },
  { icon: Table2,        name: "Tabla de reportes con vista narrativa",info: "Historial descargable con resumen en lenguaje natural" },
]

const LIMITACIONES = [
  {
    icon: Database,
    name: "Datos de entrenamiento ML",
    info: "El modelo requiere 50–100 fermentaciones históricas para alcanzar precisión útil. En fase piloto se opera con datos sintéticos aumentados o transferencia de aprendizaje.",
  },
  {
    icon: Cpu,
    name: "Capacidad del LLM local",
    info: "El LLM para notificaciones presenta limitaciones de latencia y razonamiento frente a modelos cloud. Su uso se restringe a análisis estructurado con plantillas de recomendación predefinidas.",
  },
  {
    icon: Coffee,
    name: "Dominio: café exclusivamente",
    info: "El sistema está entrenado sobre fermentaciones de café. La generalización a otros sustratos requiere reentrenamiento con datos específicos del nuevo dominio.",
  },
  {
    icon: Wifi,
    name: "Dependencia de red IoT",
    info: "La conectividad en tiempo real depende de la disponibilidad de red en el laboratorio institucional.",
  },
]

const Scope = () => (
  <section className="relative w-full overflow-hidden bg-bg">
    <div
      className="pointer-events-none absolute inset-0 select-none"
      style={{ backgroundImage: "linear-gradient(to right,#111 1px,transparent 1px),linear-gradient(to bottom,#111 1px,transparent 1px)", backgroundSize: "40px 40px" }}
    />
    <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(15,142,77,0.07), transparent)" }} />

    <div className="relative z-10 mx-auto max-w-7xl px-6 py-28 flex flex-col gap-16">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-green-500/80 font-medium">Definición del proyecto</span>
          <h2 className="flex flex-col gap-1 text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter">
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 25, stiffness: 160 }}
            >
              Alcances y
            </Text3DFlip>
            <Text3DFlip
              className="bg-transparent justify-start"
              textClassName="bg-transparent bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent"
              flipTextClassName="bg-transparent bg-linear-to-b from-white/50 to-white/20 bg-clip-text text-transparent"
              rotateDirection="top"
              staggerDuration={0.03}
              staggerFrom="first"
              transition={{ type: "spring", damping: 30, stiffness: 160 }}
            >
              limitaciones
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
          Lo que el sistema contempla en su versión actual y las restricciones técnicas declaradas ante el comité evaluador.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Alcances */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-bold px-1 mb-3">Alcances</p>
          <div className="flex flex-col gap-3">
            {ALCANCES.map((item, i) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between gap-5 rounded-2xl p-2"
                style={{ background: "#0f1a12", border: "1px solid rgba(15,142,77,0.2)" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.35, delay: 0.06 * i }}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-black p-2">
                    <item.icon className="size-5 text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-neutral-500 font-medium">{item.info}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center size-8 rounded-full bg-neutral-600 shrink-0">
                  <Pin className="size-4 text-white fill-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Limitaciones */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-bold px-1 mb-3">Limitaciones</p>
          <div className="flex flex-col gap-3">
            {LIMITACIONES.map((item, i) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between gap-5 rounded-2xl p-2"
                style={{ background: "#1a0f0f", border: "1px solid rgba(249,115,22,0.2)" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.35, delay: 0.06 * i }}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-black p-2">
                    <item.icon className="size-5 text-neutral-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="text-xs text-neutral-500 font-medium">{item.info}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center size-8 rounded-full bg-neutral-600 shrink-0 opacity-40">
                  <Pin className="size-4 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  </section>
)

export default Scope
