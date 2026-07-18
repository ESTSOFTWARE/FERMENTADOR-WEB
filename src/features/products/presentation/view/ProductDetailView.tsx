import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import { ShoppingCart, Zap, Truck, ShieldCheck, RotateCcw, Lock, Minus, Plus, Trash2 } from 'lucide-react'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useProductDetailViewModel } from '../viewmodels/useProductDetailViewModel'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'
import { OfferCard } from '../../../../components/ui/offer-carousel'
import type { ProductReview } from '../../domain/models/Product'
import { useUserAuth } from '../../../../core/hooks/userAuth'
import { useCartStore } from '../../../../core/store/useCartStore'
import { CartDrawer } from '../components/CartDrawer'
import Header from '../../../landing/presentation/components/Header'
import Footer from '../../../landing/presentation/components/Footer'
import { useLeaveReviewViewModel } from '../viewmodels/useLeaveReviewViewModel'
import { ReviewFormModal } from '../components/ReviewFormModal'
import { useDeleteReviewViewModel } from '../viewmodels/useDeleteReviewViewModel'

const SPEC_ICONS = [
  'M9 3h6M10 3v6L6 17a1 1 0 001 1h10a1 1 0 001-1L14 9V3',
  'M2 12c1.5-3 3-4.5 4.5-4.5S9 9 10.5 12s3 4.5 4.5 4.5S18 15 19.5 12',
  'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M2 12h2M20 12h2',
  'M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26A4.5 4.5 0 1014 14.76z',
  'M12 2a2 2 0 00-2 2v12a4 4 0 104 0V4a2 2 0 00-2-2z',
  'M12 2v14M8 16h8M10 20h4',
  'M5 8h14M5 8v8h14V8',
  'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'M8 2v3M16 2v3M3 8h18M3 5h18a1 1 0 011 1v13a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z',
]

const THUMB_ICONS = [
  // Matraz Erlenmeyer
  'M9 3h6M10 3v6L6.5 17a1 1 0 001 1h9a1 1 0 001-1L14 9V3',
  // Termómetro
  'M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26A4.5 4.5 0 1014 14.76z',
  // Electrodo / sonda BNC
  'M12 2v14M8 16h8M10 19h4M11 22h2',
  // Empaque / caja 3D
  'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
]

const BENEFITS = [
  { Icon: Truck, title: 'Envío nacional', desc: 'Entrega en 24–48 h hábiles' },
  { Icon: ShieldCheck, title: 'Garantía 12 meses', desc: 'Cobertura directa del fabricante' },
  { Icon: RotateCcw, title: 'Devolución 30 días', desc: 'Sin preguntas, reembolso total' },
  { Icon: Lock, title: 'Pago seguro', desc: 'Cifrado SSL · Tarjeta y SPEI' },
]

const ProductDetailView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUserAuth()
  const { addItem, openCart } = useCartStore()
  const { product, loading, error, reload } = useProductDetailViewModel(Number(id))
  const { products: allProducts } = useProductsViewModel()
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(3)

  const review = useLeaveReviewViewModel(Number(id), reload)
  const deleteReview = useDeleteReviewViewModel(Number(id), reload)

  const handleWriteReview = () => {
    if (!user) { navigate('/login', { state: { from: `/products/${id}` } }); return }
    review.setOpen(true)
  }

  useEffect(() => {
    if (product?.name) document.title = product.name
    return () => { document.title = 'Catálogo' }
  }, [product?.name])

  const handleAddToCart = () => {
    if (!product) return
    if (!user) { navigate('/login', { state: { from: `/products/${id}` } }); return }
    for (let i = 0; i < qty; i++) addItem(product)
    openCart()
  }

  const handleBuy = () => {
    if (!user) navigate('/login', { state: { from: `/products/${id}` } })
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen bg-[#0A0A0B]">
        <Header />
        <CartDrawer />
        <ReviewFormModal
          open={review.open}
          rating={review.rating}
          comment={review.comment}
          saving={review.saving}
          onRatingChange={review.setRating}
          onCommentChange={review.setComment}
          onClose={() => review.setOpen(false)}
          onSubmit={review.submit}
        />

        <motion.div variants={pageVariants} initial="hidden" animate="visible"
          className="mx-auto max-w-6xl px-6 pt-32 pb-8">

          {/* Back */}
          <motion.button variants={sectionVariants}
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors mb-10 group">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver al catálogo
          </motion.button>

          {loading && (
            <div className="flex justify-center pt-20">
              <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
                <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {error && (
            <div className="rounded-xl px-5 py-4 text-sm text-red-400 bg-red-950/30 border border-red-500/20">{error}</div>
          )}

          {!loading && !error && product && (
            <motion.div variants={sectionVariants} className="flex flex-col gap-8">

              {/* ── Main grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* LEFT */}
                <div className="flex flex-col gap-3">
                  {/* Main image */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/6"
                    style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#0a1a0e,#0d2212,#091508)' }}>
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(34,197,94,0.06),transparent)' }} />

                    {product.image
                      ? <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      : (
                        <div className="flex flex-col items-center justify-center h-full gap-3 opacity-30">
                          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-xs tracking-widest text-green-500/60 uppercase">Empaque</span>
                        </div>
                      )
                    }

                    {/* Stock badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${product.stock > 0
                        ? 'bg-black/40 text-green-400 border border-green-500/20'
                        : 'bg-black/40 text-red-400 border border-red-500/20'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                        {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                      </span>
                    </div>

                    {/* SKU */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white/30 font-mono">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      {product.sku}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {THUMB_ICONS.map((path, i) => (
                      <button key={i} onClick={() => setActiveThumb(i)}
                        className={`rounded-xl aspect-square flex items-center justify-center transition-all duration-200 border ${activeThumb === i
                          ? 'border-green-500/40'
                          : 'border-white/6 hover:border-white/15'
                          }`}
                        style={{ background: activeThumb === i ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke={activeThumb === i ? '#22C55E' : '#3F3F46'}
                          strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                          <path d={path} />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* Aviso de instalación */}
                  <div className="flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
                      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 opacity-40">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Este componente <span className="text-neutral-400 font-medium">no incluye instalación ni mano de obra.</span> El precio cubre únicamente la pieza; el servicio de colocación en el equipo debe contratarse por separado.
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-4">
                  {/* Title block */}
                  <div>
                    <span className="text-[10px] font-semibold text-green-500/70 uppercase tracking-[0.3em]">
                      Detalle del producto
                    </span>
                    <h1 className="text-4xl font-black tracking-tight text-white leading-tight mt-1">
                      {product.name}
                    </h1>
                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <svg key={s} width="14" height="14" viewBox="0 0 24 24"
                            fill={s <= Math.round(product.rating) ? '#F59E0B' : 'none'}
                            stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-white">{product.rating.toFixed(1)}</span>
                      <span className="text-neutral-600 text-sm">· {product.reviewCount ?? Math.floor(product.rating * 8)} reseñas</span>
                      <span className="text-neutral-700">•</span>
                      <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? 'En existencia' : 'Sin stock'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-400 text-sm leading-relaxed">{product.description}</p>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-xs px-3 py-1.5 rounded-full border border-white/8 text-neutral-400"
                          style={{ background: 'rgba(255,255,255,0.02)' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price box */}
                  <div className="rounded-2xl border border-white/8 p-5 flex flex-col gap-4"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-1">Precio unitario</p>
                        <div className="flex items-end gap-1.5">
                          <span className="text-4xl font-black text-white tracking-tight">
                            ${product.price.toLocaleString('es-MX')}
                          </span>
                          <span className="text-base text-neutral-500 mb-1">MXN</span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1">IVA incluido · Factura disponible</p>
                      </div>

                      {/* Qty */}
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs text-neutral-500">Cantidad</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setQty(q => Math.max(1, q - 1))}
                            className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 transition-all">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-white">{qty}</span>
                          <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                            disabled={qty >= product.stock}
                            className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 text-neutral-400 hover:text-white hover:border-white/25 transition-all disabled:opacity-30">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/6">
                      <span className="text-sm text-neutral-500">Total</span>
                      <div className="flex items-end gap-1">
                        <span className="text-xl font-black text-white">${(product.price * qty).toLocaleString('es-MX')}</span>
                        <span className="text-sm text-neutral-500 mb-0.5">MXN</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2">
                      <button onClick={handleAddToCart} disabled={product.stock === 0}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-white/15 hover:bg-white/5 text-white">
                        <ShoppingCart className="w-4 h-4" />
                        Agregar al carrito
                      </button>
                      <button onClick={handleBuy} disabled={product.stock === 0}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-200 bg-white text-[#0A0A0B]">
                        <Zap className="w-4 h-4" />
                        Comprar ahora
                      </button>
                    </div>

                    {/* Trust inline */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { Icon: Truck, label: 'Envío 24–48 h' },
                        { Icon: ShieldCheck, label: 'Garantía 12 meses' },
                        { Icon: RotateCcw, label: '30 días devolución' },
                      ].map(({ Icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1 text-center">
                          <Icon className="w-4 h-4 text-neutral-600" />
                          <span className="text-[10px] text-neutral-600 leading-snug">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata row */}
                  <div className="grid grid-cols-3 rounded-2xl border border-white/8 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {[
                      { label: 'SKU', value: product.sku, mono: true },
                      { label: 'Disponibles', value: `${product.stock} uds`, mono: false },
                      { label: 'Categoría', value: product.category ?? '—', mono: false },
                    ].map(({ label, value, mono }, i) => (
                      <div key={label} className={`flex flex-col gap-1 px-4 py-3 ${i < 2 ? 'border-r border-white/6' : ''}`}>
                        <span className="text-[10px] uppercase tracking-widest text-neutral-600">{label}</span>
                        <span className={`text-sm font-semibold text-white ${mono ? 'font-mono' : ''}`}>{value}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* ── Benefit strip ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-white/8 overflow-hidden mt-2"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                {BENEFITS.map(({ Icon, title, desc }, i) => (
                  <div key={title}
                    className={`flex items-center gap-3 px-5 py-4
                      ${i % 2 === 0 ? 'border-r border-white/6' : ''}
                      ${i === 1 ? 'lg:border-r border-white/6' : ''}
                      ${i < 2 ? 'border-b border-white/6 lg:border-b-0' : ''}
                    `}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                      <Icon className="w-4 h-4 text-green-500/70" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Ficha técnica ── */}
              {product.specs && product.specs.length > 0 && (
                <div className="flex flex-col gap-5">
                  <div>
                    <span className="text-[10px] font-semibold text-green-500/70 uppercase tracking-[0.3em]">
                      Especificaciones
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-white leading-tight mt-1">
                      Ficha técnica
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-start">
                    {/* Specs table */}
                    <div className="rounded-2xl border border-white/8 overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {product.specs.map(({ label, value }, i) => (
                        <div key={label}
                          className={`flex items-center justify-between px-5 py-3.5 ${i < product.specs!.length - 1 ? 'border-b border-white/6' : ''
                            }`}>
                          <div className="flex items-center gap-3">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                              stroke="rgba(34,197,94,0.65)" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round">
                              <path d={SPEC_ICONS[i % SPEC_ICONS.length]} />
                            </svg>
                            <span className="text-sm text-neutral-400">{label}</span>
                          </div>
                          <span className="text-sm font-semibold text-white text-right">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Inclusions card */}
                    {product.inclusions && product.inclusions.length > 0 && (
                      <div className="relative rounded-2xl overflow-hidden border border-white/6 p-6 flex flex-col"
                        style={{ background: 'linear-gradient(135deg,#0a1a0e,#0d2212,#091508)' }}>
                        <div className="absolute inset-0 pointer-events-none"
                          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 20%,rgba(34,197,94,0.06),transparent)' }} />
                        <span className="text-[10px] font-semibold text-green-500/60 uppercase tracking-[0.3em] mb-5 relative">
                          Qué incluye
                        </span>
                        <ul className="flex flex-col gap-4 flex-1 relative">
                          {product.inclusions.map(item => (
                            <li key={item} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                  stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                              <span className="text-sm text-neutral-300 leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                        {product.compatibility && (
                          <p className="text-xs text-neutral-600 leading-snug mt-6 relative">
                            {product.compatibility}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Reseñas ── */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="flex flex-col gap-5">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-green-500/70 uppercase tracking-[0.3em]">
                        Opiniones
                      </span>
                      <h2 className="text-3xl font-black tracking-tight text-white leading-tight mt-1">
                        Reseñas de clientes
                      </h2>
                    </div>
                    <button onClick={handleWriteReview}
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white border border-white/15 hover:bg-white/5 transition-all mt-1">
                      Escribir reseña
                    </button>
                  </div>

                  {/* Grid: summary + list */}
                  <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">

                    {/* Left: rating summary */}
                    <div className="rounded-2xl border border-white/8 p-6 flex flex-col gap-5"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div>
                        <div className="flex items-end gap-1.5">
                          <span className="text-5xl font-black text-white leading-none">{product.rating.toFixed(1)}</span>
                          <span className="text-lg text-neutral-500 mb-0.5">/ 5</span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-2.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <svg key={s} width="16" height="16" viewBox="0 0 24 24"
                              fill={s <= Math.round(product.rating) ? '#F59E0B' : 'none'}
                              stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs text-neutral-500 mt-2 leading-snug">
                          Basado en {product.reviewCount ?? product.reviews.length} reseñas verificadas
                        </p>
                      </div>

                      {/* Distribution bars */}
                      <div className="flex flex-col gap-2">
                        {[5, 4, 3, 2, 1].map(star => {
                          const pct = product.ratingDistribution?.[star] ?? 0
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs text-neutral-500 w-3 text-right">{star}</span>
                              <svg width="11" height="11" viewBox="0 0 24 24"
                                fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/6">
                                <div className="h-full rounded-full bg-green-500 transition-all"
                                  style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-neutral-600 w-7 text-right">{pct}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Right: review cards */}
                    <div className="flex flex-col gap-3">
                      {product.reviews.map((review: ProductReview) => {
                        const isOwn = user != null && review.userId === user.id
                        return (
                          <div key={review.id} className="rounded-2xl border border-white/8 p-5"
                            style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-green-400"
                                  style={{ background: 'linear-gradient(135deg,#0a1a0e,#0d2212)', border: '1px solid rgba(34,197,94,0.2)' }}>
                                  {review.initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-white">{review.name}</span>
                                    {review.verified && (
                                      <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                        Verificado
                                      </span>
                                    )}
                                    {isOwn && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded-full text-green-400"
                                        style={{ background: 'rgba(34,197,94,0.12)' }}>
                                        Tu reseña
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-neutral-500 mt-0.5">{review.institution}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <svg key={s} width="12" height="12" viewBox="0 0 24 24"
                                      fill={s <= review.rating ? '#F59E0B' : 'none'}
                                      stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-[10px] text-neutral-600">{review.date}</span>
                                {isOwn && (
                                  <button
                                    onClick={() => deleteReview.remove(review.id)}
                                    disabled={deleteReview.deletingId === review.id}
                                    className="flex items-center gap-1 text-[10px] text-neutral-600 hover:text-red-400 transition-colors mt-1 disabled:opacity-40"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    {deleteReview.deletingId === review.id ? 'Eliminando…' : 'Eliminar'}
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-neutral-400 leading-relaxed">{review.text}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </motion.div>

        {/* ── Productos relacionados (full width) ── */}
        {!loading && !error && product && allProducts.filter(p =>
          p.id !== product.id &&
          (p.category === product.category || p.tags?.some(t => product.tags?.includes(t)))
        ).slice(0, 5).length > 0 && (
            <div className="pb-20">
              <div className="mx-auto max-w-6xl px-6 mb-8">
                <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  También te puede servir
                </p>
                <h2 style={{ color: '#F4F4F5', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                  Productos relacionados
                </h2>
              </div>
              <div
                className="grid gap-5"
                style={{
                  paddingLeft: 'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))',
                  paddingRight: 'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}>
                {allProducts.filter(p =>
                  p.id !== product.id &&
                  (p.category === product.category || p.tags?.some(t => product.tags?.includes(t)))
                ).slice(0, 5).map(p => (
                  <OfferCard
                    key={p.id}
                    offer={{
                      id: p.id,
                      imageSrc: p.image ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
                      imageAlt: p.name,
                      tag: p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock',
                      title: p.name,
                      description: p.description,
                      brandLogoSrc: '/assets/logo.svg',
                      brandName: `$${p.price.toLocaleString('es-MX')} MXN`,
                      promoCode: p.sku,
                      href: `/products/${p.id}`,
                    }}
                    onClick={() => navigate(`/products/${p.id}`)}
                    onAddToCart={() => {
                      if (!user) { navigate('/login', { state: { from: `/products/${p.id}` } }); return }
                      addItem(p)
                      openCart()
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        <Footer />
      </div>
    </ReactLenis>
  )
}

export default ProductDetailView