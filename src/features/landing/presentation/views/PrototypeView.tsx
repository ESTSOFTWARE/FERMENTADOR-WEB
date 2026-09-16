import { ArrowLeft, ArrowUpRight, Box, MousePointer2, Scan } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PrototypeViewer from '../components/PrototypeViewer'

export default function PrototypeView() {
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
          <PrototypeViewer />
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
