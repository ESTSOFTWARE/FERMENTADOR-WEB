import { Activity, Cpu, Globe, CheckCircle2, LoaderCircle, Circle } from 'lucide-react'
import FlowArt, { FlowSection } from '../../../../components/ui/story-scroll'

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'completed') return <CheckCircle2 className="w-4 h-4 text-[#0F8E4D]" />
  if (status === 'progress')  return <LoaderCircle  className="w-4 h-4 text-[#0F8E4D] animate-spin" />
  return <Circle className="w-4 h-4 text-white/25" />
}

const TASKS_IOT = [
  { title: 'Sensores pH, temp, alcohol, turbidez', status: 'completed', meta: 'Lectura continua activa'      },
  { title: 'Transmisión RabbitMQ',                 status: 'completed', meta: 'Pipeline configurado'         },
  { title: 'Control remoto de actuadores',         status: 'progress',  meta: 'En progreso...'               },
  { title: 'Validación de lecturas',               status: 'pending',   meta: 'Pendiente'                    },
]
const TASKS_ML = [
  { title: 'Recolección y etiquetado de datos',  status: 'completed', meta: 'Dataset listo'               },
  { title: 'Regresión supervisada (eficiencia)', status: 'completed', meta: 'Métricas documentadas'        },
  { title: 'Isolation Forest (anomalías)',        status: 'progress',  meta: 'Entrenando… alertas activas' },
  { title: 'Integración con dashboard',           status: 'pending',   meta: 'Pendiente'                   },
]
const TASKS_NLP = [
  { title: 'Reportes en español',              status: 'completed', meta: 'Módulo activo'              },
  { title: 'LLM local vía ngrok',              status: 'completed', meta: 'Hospedaje configurado'      },
  { title: 'Análisis periódico de sensores',   status: 'progress',  meta: 'Generando recomendaciones…' },
  { title: 'Notificaciones push en la app web',    status: 'pending',   meta: 'Pendiente'                  },
]

function TaskList({ tasks, light = false }: { tasks: { title: string; status: string; meta: string }[]; light?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((t, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="mt-[2px] flex-shrink-0"><StatusIcon status={t.status} /></div>
          <div>
            <p className={`text-[clamp(0.7rem,1.1vw,0.85rem)] leading-snug ${
              t.status === 'completed' ? `line-through ${light ? 'text-white/40' : 'text-white/30'}` :
              t.status === 'progress'  ? `text-[#4ade80] font-medium` :
              `${light ? 'text-white/35' : 'text-white/25'}`
            }`}>{t.title}</p>
            <p className={`text-[0.7rem] mt-0.5 ${light ? 'text-white/40' : 'text-white/25'}`}>{t.meta}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const Objectives = () => (
  <FlowArt aria-label="Objetivos del proyecto">

    {/* ── 01 Objetivo general ── */}
    <FlowSection aria-label="Objetivo general" style={{ backgroundColor: '#0A3D20', color: '#fff' }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">01 — Objetivo general</p>
      <hr className="my-[2vw] border-none border-t border-white/10" style={{ borderTopWidth: 1 }} />
      <div>
        <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-black leading-[0.85] uppercase tracking-tight">
          Moni&shy;toreo<br />
          Inteli&shy;gente
        </h2>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/10" style={{ borderTopWidth: 1 }} />
      <div className="flex flex-wrap gap-[3vw]">
        <div className="min-w-[200px] flex-1">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#4ade80]">IoT</p>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-60">
            Adquisición continua de cinco variables críticas del proceso fermentativo.
          </p>
        </div>
        <div className="min-w-[200px] flex-1">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#4ade80]">ML Propio</p>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-60">
            Modelos entrenados sobre datos reales, sin APIs externas de IA.
          </p>
        </div>
        <div className="min-w-[200px] flex-1">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#4ade80]">NLP Local</p>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-60">
            Reportes interpretativos en español con un LLM hospedado localmente.
          </p>
        </div>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/10" style={{ borderTopWidth: 1 }} />
      <p className="mt-auto max-w-[55ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-70">
        Un sistema integral accesible para instituciones educativas de Latinoamérica — sin dependencia de servicios externos de IA.
      </p>
    </FlowSection>

    {/* ── 02 IoT ── */}
    <FlowSection aria-label="Adquisición IoT" style={{ backgroundColor: '#060d09', color: '#fff' }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">02 — Adquisición IoT</p>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <div>
        <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-black leading-[0.85] uppercase tracking-tight">
          Tiempo<br />
          Real
        </h2>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-60">
        El fermentador captura pH, temperatura, alcohol, turbidez y conductividad de forma continua. Los datos viajan por <span className="text-[#4ade80] font-semibold">RabbitMQ</span> y el operador puede controlar bomba y motor a pasos de forma remota.
      </p>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <div className="flex flex-wrap gap-[3vw]">
        {['pH', 'Temperatura', 'Alcohol', 'Turbidez', 'Conductividad'].map(v => (
          <div key={v} className="min-w-[120px] flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3.5 h-3.5 text-[#0F8E4D]" />
              <p className="text-sm font-bold uppercase tracking-wider">{v}</p>
            </div>
            <p className="text-[clamp(0.85rem,1.1vw,0.9rem)] leading-relaxed opacity-40">Lectura continua activa</p>
          </div>
        ))}
      </div>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <TaskList tasks={TASKS_IOT} />
    </FlowSection>

    {/* ── 03 ML ── */}
    <FlowSection aria-label="Machine Learning" style={{ backgroundColor: '#040a06', color: '#fff' }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">03 — Machine Learning</p>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <div>
        <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-black leading-[0.85] uppercase tracking-tight">
          ML<br />
          Propio
        </h2>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-60">
        Dos modelos entrenados sobre datos reales: <span className="text-[#4ade80] font-semibold">regresión supervisada</span> para predecir eficiencia final del batch e <span className="text-[#4ade80] font-semibold">Isolation Forest</span> para detectar anomalías antes de que el proceso falle.
      </p>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <div className="flex flex-wrap gap-[3vw]">
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-[#0F8E4D]" />
            <p className="text-sm font-bold uppercase tracking-wider">Regresión supervisada</p>
          </div>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-50">
            Predice la eficiencia final de cada fermentación a partir de las variables medidas en tiempo real.
          </p>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-[#0F8E4D]" />
            <p className="text-sm font-bold uppercase tracking-wider">Isolation Forest</p>
          </div>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-50">
            Detecta patrones anómalos en tiempo real y emite alertas accionables al operador.
          </p>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-[#0F8E4D]" />
            <p className="text-sm font-bold uppercase tracking-wider">Sin APIs externas</p>
          </div>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-50">
            Entrenados y ejecutados localmente sobre datos reales del proceso fermentativo.
          </p>
        </div>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <TaskList tasks={TASKS_ML} />
    </FlowSection>

    {/* ── 04 NLP ── */}
    <FlowSection aria-label="Procesamiento de lenguaje natural" style={{ backgroundColor: '#0F8E4D', color: '#fff' }}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">04 — NLP Local</p>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <div>
        <h2 className="text-[clamp(3.5rem,12vw,14rem)] font-black leading-[0.85] uppercase tracking-tight">
          Repor&shy;tes<br />
          Natu&shy;rales
        </h2>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed opacity-60">
        Al finalizar cada fermentación, un <span className="text-[#4ade80] font-semibold">LLM local hospedado vía ngrok</span> genera un reporte interpretativo en español con desviaciones del proceso y recomendaciones accionables — sin enviar datos a OpenAI.
      </p>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <div className="flex flex-wrap gap-[3vw]">
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#0F8E4D]" />
            <p className="text-sm font-bold uppercase tracking-wider">Reportes en español</p>
          </div>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-50">
            Explicación del comportamiento del proceso al finalizar cada batch.
          </p>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#0F8E4D]" />
            <p className="text-sm font-bold uppercase tracking-wider">Análisis periódico</p>
          </div>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-50">
            Monitoreo continuo con recomendaciones generadas automáticamente por el LLM.
          </p>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#0F8E4D]" />
            <p className="text-sm font-bold uppercase tracking-wider">Notificaciones push</p>
          </div>
          <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-50">
            Alertas en la app web con acciones sugeridas en tiempo real.
          </p>
        </div>
      </div>
      <hr className="my-[2vw] border-none border-t border-white/8" style={{ borderTopWidth: 1 }} />
      <TaskList tasks={TASKS_NLP} />
    </FlowSection>

  </FlowArt>
)

export default Objectives
