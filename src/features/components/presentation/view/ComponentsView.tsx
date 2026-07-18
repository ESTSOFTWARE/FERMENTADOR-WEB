import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Search, Cpu, Tags } from 'lucide-react'
import { CategoryManagerModal } from '../components/CategoryManagerModal'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useComponentsViewModel } from '../viewmodels/useComponentsViewModel'
import { OfferCard } from '../../../../components/ui/offer-carousel'
import type { Offer } from '../../../../components/ui/offer-carousel'
import type { Component } from '../../domain/models/Component'
import { useState } from 'react'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80'
const LOGO = '/assets/logo.svg'

// Mapea un componente a la misma card del catálogo de productos.
const toOffer = (c: Component): Offer => ({
  id: c.id,
  imageSrc: c.image ?? PLACEHOLDER,
  imageAlt: c.name,
  tag: c.stock > 0 ? `${c.stock} disponibles` : 'Sin stock',
  title: c.name,
  description: c.description,
  brandLogoSrc: LOGO,
  brandName: `$${c.price.toLocaleString('es-MX')} MXN`,
  promoCode: c.sku,
  href: '#',
})

// Solo lectura: los componentes los crea y edita el rol Soporte.
const ComponentsView = () => {
  const vm = useComponentsViewModel()
  const navigate = useNavigate()
  const [showCategories, setShowCategories] = useState(false)

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      className="min-h-[calc(100vh-3.5rem)] px-12 py-10" style={{ backgroundColor: '#0A0A0B' }}>

      {/* Header: título + buscador a la misma altura */}
      <motion.div variants={sectionVariants} className="flex items-center justify-between gap-6 flex-wrap mb-8">
        <div>
          <p className="text-[11px] text-green-500/80 uppercase tracking-[0.3em] mb-2">Catálogo</p>
          <h1 className="text-white text-3xl font-bold tracking-tight">Componentes</h1>
          <div className="mt-2.5 h-px w-20 bg-green-500/40" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowCategories(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            style={{ background: '#111113', border: '1px solid #2A2A2D' }}>
            <Tags className="w-4 h-4" /> Categorías
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
          <input value={vm.search} onChange={e => vm.setSearch(e.target.value)}
            placeholder="Buscar por nombre, SKU o descripción…"
            className="w-full pl-10 pr-4 py-2.5 text-sm text-neutral-300 placeholder-neutral-600 rounded-xl outline-none"
            style={{ background: '#111113', border: '1px solid #2A2A2D' }} />
        </div>
      </motion.div>

      {/* Contador */}
      <motion.div variants={sectionVariants} className="flex justify-end mb-5">
        <span className="text-xs text-neutral-500">{vm.total} componente{vm.total === 1 ? '' : 's'}</span>
      </motion.div>

      {/* Loading */}
      {vm.loading && (
        <div className="flex justify-center pt-20">
          <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
            <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Vacío */}
      {!vm.loading && vm.components.length === 0 && (
        <motion.div variants={sectionVariants}
          className="flex flex-col items-center gap-3 py-24 text-center rounded-2xl border border-white/8"
          style={{ background: 'rgba(255,255,255,0.02)' }}>
          <Cpu className="w-8 h-8 text-neutral-700" />
          <p className="text-sm text-neutral-500">
            {vm.search ? `Sin resultados para "${vm.search}"` : 'Aún no hay componentes en el catálogo.'}
          </p>
        </motion.div>
      )}

      {/* Grid de componentes (misma card del catálogo) */}
      {!vm.loading && vm.components.length > 0 && (
        <motion.div variants={sectionVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {vm.components.map(c => (
            <OfferCard key={c.id} offer={toOffer(c)} onClick={() => navigate(`/components/${c.id}`)} />
          ))}
        </motion.div>
      )}
      <CategoryManagerModal open={showCategories} onClose={() => setShowCategories(false)} />
    </motion.div>
  )
}

export default ComponentsView
