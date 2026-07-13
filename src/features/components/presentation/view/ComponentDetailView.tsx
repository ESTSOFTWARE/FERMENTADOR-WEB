import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft, Star, Tag, Boxes, Calendar, Package, Truck, ShieldCheck, RotateCcw, Lock,
  FlaskConical, Thermometer, Cable, Layers, CheckCircle2,
} from 'lucide-react'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useComponentsViewModel } from '../viewmodels/useComponentsViewModel'
import { componentsApi } from '../../data/api/componentsApi'
import { OfferCard } from '../../../../components/ui/offer-carousel'
import type { Offer } from '../../../../components/ui/offer-carousel'
import type { Component } from '../../domain/models/Component'
import { specificationsApi } from '../../data/api/specificationsApi'
import type { Specification } from '../../data/api/specificationsApi'
import { includesApi } from '../../data/api/includesApi'
import type { Include } from '../../data/api/includesApi'
import { benefitsApi } from '../../data/api/benefitsApi'
import type { Benefit } from '../../data/api/benefitsApi'
import { reviewsApi } from '../../data/api/reviewsApi'
import type { Review } from '../../data/api/reviewsApi'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80'
const LOGO = '/assets/logo.svg'

const CATEGORIES: Record<number, string> = { 1: 'Kits', 2: 'Sensores', 3: 'Módulos' }

const BENEFIT_ICONS = [Truck, ShieldCheck, RotateCcw, Lock, CheckCircle2, Package]

const THUMB_ICONS = [FlaskConical, Thermometer, Cable, Package]

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

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className="w-3.5 h-3.5"
        fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
        stroke={i <= Math.round(rating) ? '#F59E0B' : '#3F3F46'} />
    ))}
  </span>
)

const ComponentDetailView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vm = useComponentsViewModel()
  const [activeThumb, setActiveThumb] = useState(3)
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [includes, setIncludes] = useState<Include[]>([])
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [related, setRelated] = useState<Component[]>([])

  const component = vm.components.find(c => String(c.id) === id)

  useEffect(() => {
    if (!component) return
    specificationsApi.getAll(component.id).then(setSpecifications).catch(() => setSpecifications([]))
    includesApi.getAll(component.id).then(setIncludes).catch(() => setIncludes([]))
    benefitsApi.getAll(component.id).then(setBenefits).catch(() => setBenefits([]))
    reviewsApi.getAll(component.id)
      .then(r => { setReviews(r.items); setAvgRating(r.average_rating) })
      .catch(() => { setReviews([]); setAvgRating(0) })
    componentsApi.getRelated(component.id).then(r => setRelated(r.slice(0, 4))).catch(() => setRelated([]))
  }, [component?.id])


  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      className="min-h-[calc(100vh-3.5rem)] px-12 py-10" style={{ backgroundColor: '#0A0A0B' }}>

      <motion.button variants={sectionVariants} onClick={() => navigate('/components')}
        className="flex items-center gap-2 mb-8 text-xs text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Volver al catálogo
      </motion.button>

      {vm.loading && (
        <div className="flex justify-center pt-20">
          <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
            <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {!vm.loading && !component && (
        <p className="text-sm text-neutral-500">No se encontró el componente.</p>
      )}

      {component && (
        <>
          {/* Imagen + info */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Imagen + miniaturas */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/3]">
                <img src={component.image ?? PLACEHOLDER} alt={component.name} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-md"
                  style={{ background: 'rgba(0,0,0,0.6)', color: component.stock > 0 ? '#22C55E' : '#ef4444' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: component.stock > 0 ? '#22C55E' : '#ef4444' }} />
                  {component.stock > 0 ? `${component.stock} en stock` : 'Sin stock'}
                </span>
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] font-mono text-white/70">
                  <Tag className="w-3 h-3" /> {component.sku}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {THUMB_ICONS.map((Icon, i) => (
                  <button key={i} onClick={() => setActiveThumb(i)}
                    className="aspect-square rounded-2xl flex items-center justify-center transition-colors"
                    style={{
                      background: i === activeThumb ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${i === activeThumb ? 'rgba(34,197,94,0.4)' : '#1F1F22'}`,
                    }}>
                    <Icon className="w-5 h-5" style={{ color: i === activeThumb ? '#22C55E' : '#3F3F46' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[11px] text-green-500/80 uppercase tracking-[0.3em] mb-2">Detalle del componente</p>
                <h1 className="text-white text-4xl font-bold tracking-tight leading-tight">{component.name}</h1>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-sm">
                <Stars rating={component.rating} />
                <span className="text-white font-semibold">{component.rating.toFixed(1)}</span>
                <span className="text-neutral-600">•</span>
                <span className={component.stock > 0 ? 'text-green-500 font-semibold' : 'text-red-400 font-semibold'}>
                  {component.stock > 0 ? 'En existencia' : 'Sin stock'}
                </span>
              </div>

              <p className="text-neutral-400 text-base leading-relaxed">{component.description}</p>

              {/* Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  CATEGORIES[component.category_id ?? 0] ?? 'General',
                  `SKU ${component.sku}`,
                  `${component.stock} unidades`,
                ].map(chip => (
                  <span key={chip} className="px-4 py-2 rounded-full text-xs text-neutral-300"
                    style={{ background: '#111113', border: '1px solid #2A2A2D' }}>
                    {chip}
                  </span>
                ))}
              </div>

              {/* Precio */}
              <div className="rounded-3xl p-6 border border-white/10 flex flex-col gap-4"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-[10px] uppercase tracking-widest text-neutral-600">Precio unitario</p>
                <p className="text-4xl font-black text-white tracking-tight">
                  ${component.price.toLocaleString('es-MX')} <span className="text-base text-neutral-500 font-semibold">MXN</span>
                </p>
                <p className="text-xs text-neutral-600">IVA incluido · Factura disponible</p>

                {benefits.length > 0 && (
                  <>
                    <div className="h-px bg-white/8" />

                    <div className="grid grid-cols-3 gap-3">
                      {benefits.slice(0, 3).map((b, i) => {
                        const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
                        return (
                          <div key={b.id} className="flex flex-col items-center gap-1.5 text-center">
                            <Icon className="w-4 h-4 text-neutral-600" />
                            <span className="text-[10px] text-neutral-500">{b.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* SKU / disponibles / categoría */}
              <div className="grid grid-cols-3 rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                {[
                  { label: 'SKU',         value: component.sku },
                  { label: 'Disponibles', value: `${component.stock} uds` },
                  { label: 'Categoría',   value: CATEGORIES[component.category_id ?? 0] ?? 'General' },
                ].map((d, i) => (
                  <div key={d.label} className={`px-5 py-4 flex flex-col gap-1 ${i < 2 ? 'border-r border-white/8' : ''}`}>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-600">{d.label}</span>
                    <span className="text-sm font-semibold text-white font-mono">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Beneficios */}
          {benefits.length > 0 && (
            <motion.div variants={sectionVariants}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 rounded-3xl border border-white/8 overflow-hidden mb-16"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              {benefits.map((b, i) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
                return (
                  <div key={b.id} className={`flex items-center gap-4 px-6 py-6 ${i < benefits.length - 1 ? 'xl:border-r border-white/8' : ''}`}>
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.1)' }}>
                      <Icon className="w-4 h-4 text-green-500" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{b.title}</p>
                      {b.description && <p className="text-xs text-neutral-500 mt-0.5">{b.description}</p>}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* Ficha técnica */}
          <motion.div variants={sectionVariants} className="mb-16">
            <p className="text-[11px] text-green-500/80 uppercase tracking-[0.3em] mb-2">Especificaciones</p>
            <h2 className="text-white text-3xl font-bold tracking-tight mb-8">Ficha técnica</h2>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
              <div className="rounded-3xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                {[
                  { icon: Package,   label: 'SKU',           value: component.sku },
                  { icon: Layers,    label: 'Categoría',     value: CATEGORIES[component.category_id ?? 0] ?? 'General' },
                  { icon: Boxes,     label: 'Existencias',   value: `${component.stock} unidades` },
                  { icon: Star,      label: 'Valoración',    value: `${component.rating.toFixed(1)} / 5` },
                  { icon: Tag,       label: 'Precio',        value: `$${component.price.toLocaleString('es-MX')} MXN` },
                  { icon: Calendar,  label: 'Agregado',      value: fmtDate(component.created_at) },
                  ...specifications.map(s => ({ icon: Layers, label: s.name, value: s.value })),
                ].map((s, i, arr) => (
                  <div key={s.label}
                    className={`flex items-center justify-between px-6 py-4 ${i < arr.length - 1 ? 'border-b border-white/6' : ''}`}>
                    <span className="flex items-center gap-3 text-sm text-neutral-400">
                      <s.icon className="w-4 h-4 text-green-500/70" /> {s.label}
                    </span>
                    <span className="text-sm font-semibold text-white">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border p-6 flex flex-col gap-4"
                style={{ background: 'linear-gradient(160deg, rgba(34,197,94,0.08), rgba(0,0,0,0.2))', borderColor: 'rgba(34,197,94,0.25)' }}>
                <p className="text-[10px] uppercase tracking-widest text-green-500/80">Qué incluye</p>
                <ul className="flex flex-col gap-3">
                  {[`${component.name} (${component.sku})`, ...includes.map(inc => inc.description)].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                  Compatible con los equipos Nich-Ká. El precio cubre únicamente la pieza; la instalación se contrata por separado.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Reseñas */}
          <motion.div variants={sectionVariants} className="mb-16">
            <p className="text-[11px] text-green-500/80 uppercase tracking-[0.3em] mb-2">Opiniones</p>
            <h2 className="text-white text-3xl font-bold tracking-tight mb-8">Reseñas de clientes</h2>

            {reviews.length === 0 ? (
              <div className="rounded-3xl border border-white/8 p-10 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-sm text-neutral-500">Este componente aún no tiene reseñas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Resumen */}
                <div className="rounded-3xl border border-white/8 p-6 flex flex-col items-center gap-3 h-fit"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-white">{avgRating.toFixed(1)}</span>
                    <span className="text-neutral-500 mb-1">/ 5</span>
                  </div>
                  <Stars rating={avgRating} />
                  <p className="text-xs text-neutral-500">{reviews.length} reseña{reviews.length === 1 ? '' : 's'}</p>
                </div>

                {/* Lista */}
                <div className="flex flex-col gap-4">
                  {reviews.map(r => (
                    <div key={r.id} className="rounded-2xl border border-white/8 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold text-green-500"
                            style={{ background: 'rgba(34,197,94,0.12)' }}>U{r.user_id}</span>
                          <span className="text-sm text-neutral-300">Usuario #{r.user_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stars rating={r.rating} />
                          <span className="text-[11px] text-neutral-600">{fmtDate(r.created_at)}</span>
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-neutral-400 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Relacionados */}
          {related.length > 0 && (
            <motion.div variants={sectionVariants}>
              <p className="text-[11px] text-green-500/80 uppercase tracking-[0.3em] mb-2">También te puede servir</p>
              <h2 className="text-white text-3xl font-bold tracking-tight mb-8">Componentes relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {related.map(c => (
                  <OfferCard key={c.id} offer={toOffer(c)} onClick={() => navigate(`/components/${c.id}`)} />
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  )
}

export default ComponentDetailView
