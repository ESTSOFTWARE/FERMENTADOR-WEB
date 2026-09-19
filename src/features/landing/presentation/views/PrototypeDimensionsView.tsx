import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Ruler } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PARTS = [
  {
    id: 'nichka', name: 'Prototipo completo',
    description: 'El conjunto integra la caja de soporte, el reactor, la pantalla y la bomba para reunir el proceso de fermentación y sus controles en un mismo equipo.',
    dimensions: [['Caja de soporte', '47 × 36.5 × 12.5 cm'], ['Cuerpo del reactor', 'Ø 15 × 21 cm']],
    detail: 'La tapa es abatible y cuenta con bisagras traseras. Esto permite abrir el conjunto para acceder a su interior.',
    note: 'Las medidas corresponden a la caja y al cuerpo del reactor por separado; no indican la altura total del equipo ensamblado.',
  },
  {
    id: 'base', name: 'Base',
    description: 'Es la caja que sostiene los componentes y aloja la electrónica y el cableado. Su superficie superior sirve de soporte para montar el resto del prototipo.',
    dimensions: [['Dimensiones de la caja', '47 × 36.5 × 12.5 cm']],
    detail: 'Conserva los controles frontales, los indicadores y el cierre. Estos elementos permiten operar el equipo y acceder a los componentes alojados dentro de la base.',
    note: 'Estas medidas describen la caja, no el conjunto con el reactor y los demás accesorios montados.',
  },
  {
    id: 'reactor', name: 'Reactor',
    description: 'Es el recipiente que contiene el medio de fermentación. Integra la tapa y el conjunto de agitación para mezclar el contenido durante el proceso.',
    dimensions: [['Diámetro exterior', '15 cm'], ['Altura del cuerpo', '21 cm']],
    detail: 'Incluye un motor NEMA 17 sobre la tapa, que acciona el eje del agitador. La agitación ayuda a distribuir el contenido de forma uniforme.',
    note: 'Los 21 cm corresponden al cuerpo del reactor; el motor y los elementos que sobresalen de la tapa aumentan la altura del conjunto.',
  },
  {
    id: 'base_lcd', name: 'Base LCD',
    description: 'Es la carcasa inclinada que sostiene la pantalla del equipo. Su forma facilita la lectura y protege el módulo de visualización.',
    dimensions: [['Carcasa', '13.97 × 10.94 × 11.5 cm'], ['Pantalla', '7.3 × 0.1 × 2.0 cm']],
    detail: 'La pantalla se integra en la cara frontal inclinada para consultar la información del prototipo desde una posición cómoda.',
    note: 'La carcasa y la pantalla tienen medidas independientes: una corresponde al soporte y la otra al elemento de visualización representado.',
  },
  {
    id: 'bomba', name: 'Bomba',
    description: 'Es el conjunto encargado de impulsar líquido por las mangueras. Su función en el proceso depende de las conexiones del circuito.',
    dimensions: [['Conjunto mecánico', '7.34 × 11.63 × 5.85 cm'], ['Cables rojo y negro', '≈ 4.5 cm']],
    detail: 'El modelo reúne el cuerpo de la bomba, el motor, los puntos de montaje y los cables de alimentación.',
    note: 'La medida del conjunto mecánico no incluye la extensión de los cables. La longitud indicada para los cables es aproximada.',
  },
]

export default function PrototypeDimensionsView() {
  const [index, setIndex] = useState(0)
  const part = PARTS[index]
  const changePart = (direction: number) => setIndex(current => (current + direction + PARTS.length) % PARTS.length)
  const arrowClass = 'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-green-400/20 hover:text-green-400 focus-visible:outline-2 focus-visible:outline-green-400 sm:h-12 sm:w-12'

  return (
    <div className="min-h-screen bg-bg text-white">
      <Header />
      <main className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-130 bg-[size:40px_40px] bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-130 bg-radial-[ellipse_65%_60%_at_50%_0%] from-green-500/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <Link to="/prototipo" className="mb-8 inline-flex items-center gap-2 text-xs text-neutral-400 transition hover:text-white"><ArrowLeft size={14} />Volver al modelo 3D</Link>
          <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-green-400">Diseño y dimensiones</span>
              <h1 className="mt-4 bg-linear-to-b from-white to-white/50 bg-clip-text text-5xl font-black leading-[1.05] tracking-tighter text-transparent sm:text-6xl">Cada pieza,<br />en su medida.</h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">Conoce las medidas y la función de los componentes de Nich-Ká. Selecciona una pieza para explorar su imagen y consultar sus dimensiones en centímetros.</p>
          </div>
          <div role="group" aria-label="Seleccionar pieza" className="mb-5 flex flex-wrap gap-2">
            {PARTS.map((item, itemIndex) => <button key={item.id} type="button" aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)} className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-green-400 ${index === itemIndex ? 'border-green-400/40 bg-green-400/10 text-green-400' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}>{item.name}</button>)}
          </div>
          <section aria-labelledby="dimensions-title" className="overflow-hidden rounded-3xl border border-white/10 bg-[#111514]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <h2 id="dimensions-title" className="text-sm font-medium">Nich-Ká <span className="ml-2 text-neutral-400">/ {part.name}</span></h2>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-green-400"><Ruler size={14} />Medidas en cm</span>
            </div>
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              <div className="relative min-w-0 bg-[#171b1a]">
                <img key={part.id} src={`/assets/prototype/${part.id}.png`} alt={`Vista de ${part.name.toLowerCase()} de Nich-Ká`} width={1800} height={1400} className="h-auto w-full object-contain lg:h-full lg:max-h-160" />
                <button type="button" aria-label="Pieza anterior" title="Pieza anterior" onClick={() => changePart(-1)} className={`${arrowClass} left-2 sm:left-4`}><ChevronLeft size={24} /></button>
                <button type="button" aria-label="Pieza siguiente" title="Pieza siguiente" onClick={() => changePart(1)} className={`${arrowClass} right-2 sm:right-4`}><ChevronRight size={24} /></button>
              </div>
              <div aria-live="polite" aria-atomic="true" className="flex flex-col justify-center gap-6 border-t border-white/10 p-6 sm:p-8 lg:border-t-0 lg:border-l">
                <div><p className="mb-2 text-xs uppercase tracking-[0.2em] text-green-400">Ficha de medidas · {String(index + 1).padStart(2, '0')} / 05</p><h3 className="text-2xl font-semibold tracking-tight">{part.name}</h3></div>
                <dl className="space-y-4">
                  {part.dimensions.map(([label, value]) => <div key={label} className="rounded-2xl border border-green-400/15 bg-green-400/5 p-4"><dt className="mb-2 text-xs text-neutral-400">{label}</dt><dd className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{value}</dd></div>)}
                </dl>
                <p className="text-xs leading-relaxed text-neutral-400">{part.note}</p>
              </div>
            </div>
          </section>
          <section aria-live="polite" aria-atomic="true" aria-labelledby="part-explanation" className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <h2 id="part-explanation" className="mb-4 text-base font-semibold">Conoce {part.name.toLowerCase()}</h2>
            <div className="grid gap-5 md:grid-cols-2 md:gap-8">
              <div><h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-green-400">¿Qué es y qué hace?</h3><p className="text-sm leading-relaxed text-neutral-400">{part.description}</p></div>
              <div><h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-green-400">Detalles del diseño</h3><p className="text-sm leading-relaxed text-neutral-400">{part.detail}</p></div>
            </div>
          </section>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500">Ø indica diámetro y ≈ indica una medida aproximada. Las imágenes ilustran cada pieza; no se muestran a una escala común.</p>
          <Link to="/prototipo" className="mt-8 inline-flex items-center gap-2 text-sm text-neutral-300 transition hover:text-green-400">Explorar los modelos en 3D<ArrowUpRight size={16} /></Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
