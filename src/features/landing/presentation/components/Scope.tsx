import {
  Activity, Radio, Clock,
  Zap, TrendingUp, AlertTriangle,
  FileText, MessageSquare, Bell, Smartphone, Users, Calculator, Table2,
  Database, Cpu, Coffee, Wifi,
} from 'lucide-react'
import VerticalTabs, { type TabItem } from '../../../../components/ui/vertical-tabs'

const tabs: TabItem[] = [
  {
    id: '01',
    title: 'IoT & Hardware',
    image: '/assets/gestion.jpeg',
    description: (
      <div className="flex flex-col gap-4">
        {[
          { Icon: Activity,      name: 'Monitoreo en tiempo real',       info: '5 sensores: pH, temperatura, alcohol, turbidez y conductividad' },
          { Icon: Radio,         name: 'Control remoto de actuadores',   info: 'Bomba y motor a pasos desde la plataforma web' },
          { Icon: Clock,         name: 'Registro histórico completo',    info: 'Inicio/fin de fermentación con trazabilidad por sesión' },
        ].map(({ Icon, name, info }) => (
          <div key={name} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg p-1.5 flex-shrink-0" style={{ background: 'rgba(15,142,77,0.15)', border: '1px solid rgba(15,142,77,0.3)' }}>
              <Icon className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-white/50 leading-snug mt-0.5">{info}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: '02',
    title: 'Machine Learning',
    image: '/assets/banner.png',
    description: (
      <div className="flex flex-col gap-4">
        {[
          { Icon: Zap,           name: 'Algoritmo genético',            info: 'Optimización experimental de parámetros de fermentación' },
          { Icon: TrendingUp,    name: 'ML — predicción de eficiencia', info: 'Modelo supervisado que predice el resultado desde la mitad del proceso' },
          { Icon: AlertTriangle, name: 'ML — detección de anomalías',   info: 'Isolation Forest / Autoencoder en tiempo real con alertas' },
        ].map(({ Icon, name, info }) => (
          <div key={name} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg p-1.5 flex-shrink-0" style={{ background: 'rgba(15,142,77,0.15)', border: '1px solid rgba(15,142,77,0.3)' }}>
              <Icon className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-white/50 leading-snug mt-0.5">{info}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: '03',
    title: 'Plataforma & NLP',
    image: '/assets/plataforma.png',
    description: (
      <div className="flex flex-col gap-3">
        {[
          { Icon: FileText,      name: 'Reportes PDF automáticos',            info: 'Generados al finalizar cada fermentación' },
          { Icon: MessageSquare, name: 'NLP — análisis narrativo',            info: 'Párrafo interpretativo post-fermentación sin APIs externas' },
          { Icon: Bell,          name: 'Notificaciones push con LLM',         info: 'Recomendaciones accionables basadas en lecturas de sensores' },
          { Icon: Smartphone,    name: 'App móvil con simulador',             info: 'Para estudiantes con modo simulador pedagógico' },
          { Icon: Users,         name: 'Gestión multirol',                    info: 'Admin → Docente → Estudiante con permisos diferenciados' },
          { Icon: Calculator,    name: 'Calculadora de eficiencia',           info: 'Fórmula Gay-Lussac validada con parámetros reales' },
          { Icon: Table2,        name: 'Tabla de reportes con vista narrativa', info: 'Historial descargable con resumen en lenguaje natural' },
        ].map(({ Icon, name, info }) => (
          <div key={name} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg p-1.5 flex-shrink-0" style={{ background: 'rgba(15,142,77,0.15)', border: '1px solid rgba(15,142,77,0.3)' }}>
              <Icon className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-white/50 leading-snug mt-0.5">{info}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: '04',
    title: 'Limitaciones',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=80',
    description: (
      <div className="flex flex-col gap-4">
        {[
          { Icon: Database, name: 'Datos de entrenamiento ML',   info: 'El modelo requiere 50–100 fermentaciones históricas para alcanzar precisión útil. En fase piloto se opera con datos sintéticos aumentados o transferencia de aprendizaje.' },
          { Icon: Cpu,      name: 'Capacidad del LLM local',     info: 'El LLM para notificaciones presenta limitaciones de latencia y razonamiento frente a modelos cloud. Su uso se restringe a análisis estructurado con plantillas de recomendación predefinidas.' },
          { Icon: Coffee,   name: 'Dominio: café exclusivamente', info: 'El sistema está entrenado sobre fermentaciones de café. La generalización a otros sustratos requiere reentrenamiento con datos específicos del nuevo dominio.' },
          { Icon: Wifi,     name: 'Dependencia de red IoT',      info: 'La conectividad en tiempo real depende de la disponibilidad de red en el laboratorio institucional.' },
        ].map(({ Icon, name, info }) => (
          <div key={name} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg p-1.5 flex-shrink-0" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <Icon className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-white/50 leading-snug mt-0.5">{info}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
]

const Scope = () => (
  <section id="alcances" className="relative w-full overflow-hidden" style={{ background: '#0A0A0B' }}>
    <div
      className="pointer-events-none absolute inset-0 select-none"
      style={{ backgroundImage: 'linear-gradient(to right,#111 1px,transparent 1px),linear-gradient(to bottom,#111 1px,transparent 1px)', backgroundSize: '40px 40px' }}
    />
    <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(15,142,77,0.07), transparent)' }} />

    <div className="relative z-10 py-28">
      <VerticalTabs
        tabs={tabs}
        heading={
          <span>
            Alcances <span className="text-white/30">&</span> limitaciones
          </span>
        }
        subheading="Definición del proyecto"
      />
    </div>
  </section>
)

export default Scope
