import { ArrowLeft, ArrowUpRight, Box, ChevronLeft, ChevronRight, MousePointer2, Scan } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PrototypeViewer from '../components/PrototypeViewer'

const MODELS = [
  {
    file: 'nichka.glb', label: 'Prototipo completo',
    description: 'Es el conjunto de piezas que forman Nich-Ká: la base, el reactor, el soporte de la pantalla y la bomba.',
    purpose: 'Integra el recipiente de fermentación con los elementos de soporte, monitoreo y manejo de líquidos. Esta vista permite entender cómo se distribuyen y conectan las partes del equipo.',
  },
  {
    file: 'base.glb', label: 'Base',
    description: 'Es la estructura inferior sobre la que se montan los componentes del prototipo, adentro contiene los componentes electronicos.',
    purpose: 'Da soporte al conjunto y ofrece un espacio para organizar la electrónica y el cableado. En su parte frontal reúne los controles e indicadores del equipo.',
  },
  {
    file: 'reactor.glb', label: 'Reactor',
    description: 'Es el recipiente donde se coloca el medio que se va a fermentar.',
    purpose: 'Contiene el proceso de fermentación y permite integrar los elementos de medición y agitación. Los sensores permiten seguir las condiciones del proceso y el agitador ayuda a mantener una mezcla uniforme.',
  },
  {
    file: 'base_lcd.glb', label: 'Base LCD',
    description: 'Es la carcasa inclinada que sostiene y enmarca la pantalla LCD del prototipo.',
    purpose: 'Mantiene la pantalla en una posición cómoda para consultar la información del equipo y ofrece soporte y protección al módulo de visualización.',
  },
  {
    file: 'bomba.glb', label: 'Bomba',
    description: 'Es el componente encargado de impulsar líquido a través de las mangueras del sistema.',
    purpose: 'Permite trasladar líquido entre los puntos conectados al circuito. Su función concreta, como alimentar, recircular o extraer líquido, depende de cómo se conecte al reactor.',
  },
]

export default function PrototypeView() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0])
  const changeModel = (direction: number) => {
    setSelectedModel(current => {
      const index = MODELS.findIndex(model => model.file === current.file)
      return MODELS[(index + direction + MODELS.length) % MODELS.length]
    })
  }
  const modelArrowClass = 'absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-lg backdrop-blur-md transition-colors hover:border-green-400/40 hover:bg-green-400/15 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 sm:h-12 sm:w-12'

  return (
    <div className="min-h-screen bg-bg text-white">
      <Header />
      <main className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-130 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-130 bg-radial-[ellipse_65%_60%_at_50%_0%] from-green-500/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs text-neutral-400 transition hover:text-white"><ArrowLeft size={14} />Volver al inicio</Link>
          <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-green-400">Diseñado para explorar</span>
              <h1 className="mt-4 bg-linear-to-b from-white to-white/50 bg-clip-text text-5xl font-black leading-[1.05] tracking-tighter text-transparent sm:text-6xl">Nuestro prototipo,<br />desde cada ángulo.</h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">Conoce Nich-Ká en tres dimensiones. Gira el modelo, acércate a sus detalles y explora el diseño de nuestro prototipo de fermentación.</p>
          </div>
          <div className="mb-5">
            <p id="model-selector-label" className="mb-3 text-xs text-neutral-400">Explora el prototipo completo o selecciona una pieza</p>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="model-selector-label">
              {MODELS.map(model => (
                <button
                  key={model.file}
                  type="button"
                  aria-pressed={selectedModel.file === model.file}
                  onClick={() => setSelectedModel(model)}
                  className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 ${selectedModel.file === model.file ? 'border-green-400/40 bg-green-400/10 text-green-400' : 'border-white/10 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <PrototypeViewer key={selectedModel.file} src={`/assets/model/${selectedModel.file}`} label={selectedModel.label} />
            <button type="button" aria-label="Modelo anterior" title="Modelo anterior" onClick={() => changeModel(-1)} className={`${modelArrowClass} left-2 sm:left-5`}>
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Modelo siguiente" title="Modelo siguiente" onClick={() => changeModel(1)} className={`${modelArrowClass} right-2 sm:right-5`}>
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
          <section aria-live="polite" aria-atomic="true" aria-labelledby="selected-model-heading" className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <h2 id="selected-model-heading" className="mb-4 flex items-center gap-2 text-base font-semibold text-white"><Box size={18} className="text-green-400" aria-hidden="true" />{selectedModel.label}</h2>
            <dl className="grid gap-5 md:grid-cols-2 md:gap-8">
              <div>
                <dt className="mb-2 text-xs font-medium uppercase tracking-wider text-green-400">¿Qué es?</dt>
                <dd className="text-sm leading-relaxed text-neutral-400">{selectedModel.description}</dd>
              </div>
              <div>
                <dt className="mb-2 text-xs font-medium uppercase tracking-wider text-green-400">¿Qué hace?</dt>
                <dd className="text-sm leading-relaxed text-neutral-400">{selectedModel.purpose}</dd>
              </div>
            </dl>
          </section>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Box, title: 'Una mirada completa', text: 'Recorre el prototipo desde cualquier ángulo con la vista de 360°.' },
              { icon: Scan, title: 'Acércate a los detalles', text: 'Explora la forma y la disposición de las piezas a tu propio ritmo.' },
              { icon: MousePointer2, title: 'Tú tienes el control', text: 'Usa el mouse o la pantalla táctil. Restablece la vista cuando quieras.' },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><Icon size={20} className="mb-4 text-green-400" /><h2 className="mb-2 text-sm font-medium">{title}</h2><p className="text-xs leading-relaxed text-neutral-400">{text}</p></div>)}
          </div>
          <Link to="/hardware" className="mt-8 inline-flex items-center gap-2 text-sm text-neutral-300 transition hover:text-green-400">Conoce el hardware de Nich-Ká<ArrowUpRight size={16} /></Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
