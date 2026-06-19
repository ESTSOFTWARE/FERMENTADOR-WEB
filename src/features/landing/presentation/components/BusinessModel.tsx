import { BarChart2, Bot, Smartphone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedScroll, { type ScrollPage } from '../../../../components/ui/animated-scroll'

const GREEN  = '#0F8E4D'
const GREEN2 = '#0a6e3b'
const DARK   = '#0A0A0B'
const DARK2  = '#111113'

const pages: ScrollPage[] = [
  {
    leftBg: GREEN,
    rightBg: DARK,
    leftBgImage: null,
    leftBgVideo: '/assets/videos/nich-ka.mp4',
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: 'Modelo de negocio',
      description: (
        <div className="flex flex-col gap-5 text-left w-full">
          <p className="text-white/70 text-sm leading-relaxed">
            Combinamos <span className="text-white font-semibold">Hardware as a Service</span> y{' '}
            <span className="text-white font-semibold">Software as a Service</span> en un único modelo
            accesible para instituciones educativas de Latinoamérica.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'HaaS', sub: 'Kit físico $600–$900 USD', color: '#fbbf24' },
              { label: 'SaaS', sub: 'Suscripción mensual / anual', color: '#a78bfa' },
              { label: 'Consultoría', sub: 'Onboarding y capacitación', color: '#34d399' },
              { label: 'Mantenimiento', sub: 'Repuestos y soporte', color: '#60a5fa' },
            ].map(({ label, sub, color }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${color}30` }}>
                <p className="text-xs font-bold" style={{ color }}>{label}</p>
                <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{sub}</p>
              </div>
            ))}
          </div>
          <Link to="/planes"
            className="inline-flex items-center justify-center gap-2 self-start mt-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            style={{ background: '#22C55E' }}>
            Ver planes
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-white/25 text-xs uppercase tracking-widest mt-1">↓ Desplaza para explorar</p>
        </div>
      ),
    },
  },

  {
    leftBg: DARK2,
    rightBg: GREEN2,
    leftBgImage: null,
    rightBgImage: null,
    rightBgVideo: '/assets/videos/kit.mp4',
    leftContent: {
      heading: 'Hardware como servicio',
      description: (
        <div className="flex flex-col gap-4 text-left w-full">
          <p className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-tighter text-white">
            Kit físico<br /><span className="text-amber-400">$600–$900</span><br />USD
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            Fermentador + 5 sensores + módulo IoT + actuadores. El Admin activa el equipo con código
            único incluido en el kit.
          </p>
          <div className="flex flex-col gap-2">
            {['pH · Temperatura · Alcohol', 'Turbidez · Conductividad', 'Bomba y motor a pasos', 'Alternativa a equipos de $15K+'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/55">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    rightContent: null,
  },

  {
    leftBg: GREEN,
    rightBg: DARK,
    leftBgImage: null,
    leftBgVideo: '/assets/videos/plataforma.mp4',
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: 'Plataforma en la nube',
      description: (
        <div className="flex flex-col gap-4 text-left w-full">
          <p className="text-white/70 text-sm leading-relaxed">
            Sin límite de usuarios. Cada docente gestiona sus fermentaciones, los estudiantes
            consultan datos en tiempo real y el Admin administra el sistema completo desde un
            panel unificado.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Monitoreo en tiempo real',       Icon: BarChart2    },
              { title: 'NLP local — reportes en español', Icon: Bot          },
              { title: 'App móvil para Android',   Icon: Smartphone   },
            ].map(({ title, Icon }) => (
              <div key={title} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Icon className="w-4 h-4 text-white/50 flex-shrink-0" />
                <span className="text-sm text-white/70">{title}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  },

  {
    leftBg: DARK2,
    rightBg: GREEN2,
    leftBgImage: null,
    rightBgImage: null,
    rightBgVideo: '/assets/videos/capacitacion.mp4',
    leftContent: {
      heading: 'Consultoría y onboarding',
      description: (
        <div className="flex flex-col gap-4 text-left w-full">
          <p className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-tighter text-white">
            Capacitación<br /><span className="text-emerald-400">docente</span>
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            Onboarding presencial o remoto: calibración de sensores, validación de parámetros locales
            y personalización del simulador para el currículo de cada institución.
          </p>
          <div className="flex flex-col gap-2">
            {['Calibración y validación de parámetros', 'Capacitación al equipo docente', 'Soporte con reemplazo de sensores', 'Revisiones periódicas del hardware'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/55">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    rightContent: null,
  },

  {
    leftBg: GREEN,
    rightBg: DARK,
    leftBgImage: null,
    leftBgVideo: '/assets/videos/foso_competitivo.mp4',
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: 'Foso competitivo',
      description: (
        <div className="flex flex-col gap-4 text-left w-full">
          <p className="text-white/70 text-sm leading-relaxed">
            Un modelo de negocio que crea ventaja sostenible basada en datos propios del dominio
            fermentativo que ningún competidor puede replicar fácilmente.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { stat: '$600–$900',  label: 'Hardware accesible vs $15K+ industrial' },
              { stat: 'Sin APIs',   label: 'ML e NLP corriendo localmente' },
              { stat: 'Multi-rol',  label: 'Admin → Docente → Estudiante' },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(15,142,77,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <span className="text-sm font-black text-green-400 w-20 flex-shrink-0">{stat}</span>
                <span className="text-xs text-white/60 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  },
]

const BusinessModel = () => (
  <section id="negocio" className="w-full">
    <AnimatedScroll pages={pages} />
  </section>
)

export default BusinessModel
