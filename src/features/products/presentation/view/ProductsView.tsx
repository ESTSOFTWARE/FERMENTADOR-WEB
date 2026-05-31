import { motion }               from 'motion/react'
import { ReactLenis }           from 'lenis/react'
import { useNavigate }          from 'react-router-dom'
import { useState, useMemo }    from 'react'
import { Search }               from 'lucide-react'
import Fuse                     from 'fuse.js'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useProductsViewModel } from '../viewmodels/useProductsViewModel'
import { OfferCard }            from '../../../../components/ui/offer-carousel'
import type { Offer }           from '../../../../components/ui/offer-carousel'
import { CartDrawer }           from '../components/CartDrawer'
import Header                   from '../../../landing/presentation/components/Header'
import Footer                   from '../../../landing/presentation/components/Footer'
import { useCartStore }         from '../../../../core/store/useCartStore'
import { useUserAuth }          from '../../../../core/hooks/userAuth'
import type { Product }         from '../../domain/models/Product'

const LOGO = '/assets/logo.svg'

const toOffer = (p: Product): Offer => ({
  id:           p.id,
  imageSrc:     p.image ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  imageAlt:     p.name,
  tag:          p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock',
  title:        p.name,
  description:  p.description,
  brandLogoSrc: LOGO,
  brandName:    `$${p.price.toLocaleString('es-MX')} MXN`,
  promoCode:    p.sku,
  href:         `/products/${p.id}`,
})

const ProductsView = () => {
  const { products, loading, error } = useProductsViewModel()
  const navigate                     = useNavigate()
  const { user }                     = useUserAuth()
  const { addItem, openCart }        = useCartStore()
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => new Fuse(products, {
    keys:              [
      { name: 'name',        weight: 0.5 },
      { name: 'category',    weight: 0.3 },
      { name: 'sku',         weight: 0.15 },
      { name: 'description', weight: 0.05 },
    ],
    threshold:         0.45,
    distance:          200,
    includeScore:      false,
    ignoreLocation:    true,
    minMatchCharLength: 2,
  }), [products])

  const filtered = query.trim()
    ? fuse.search(query).map(r => r.item)
    : products

  const handleAddToCart = (product: Product) => {
    if (!user) { navigate('/login', { state: { from: '/products' } }); return }
    addItem(product)
    openCart()
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B' }}>
        <Header />
        <CartDrawer />

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-7xl px-12 pt-36 pb-16"
        >
          <motion.div variants={sectionVariants} style={{ marginBottom: 32 }}>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  Plataforma Nich-ká
                </p>
                <h1 style={{ color: '#F4F4F5', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                  Catálogo de productos
                </h1>
                <div style={{ marginTop: 10, height: 1, width: 80, backgroundColor: '#22C55E', opacity: 0.4 }} />
              </div>

              {/* Buscador */}
              <div className="relative flex-shrink-0 w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por nombre, SKU o categoría…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-neutral-300 placeholder-neutral-600 rounded-xl outline-none transition-colors"
                  style={{ background: '#111113', border: '1px solid #2A2A2D' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)' }}
                  onBlur={e  => { e.currentTarget.style.borderColor = '#2A2A2D' }}
                />
              </div>
            </div>
          </motion.div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
                <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {error && (
            <div style={{ padding: '16px 20px', borderRadius: 12, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13 }}>
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 80, color: '#71717A', fontSize: 14 }}>
              No hay productos disponibles actualmente.
            </div>
          )}

          {!loading && !error && products.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 pt-20 text-center">
              <Search className="w-8 h-8 text-neutral-700" />
              <p className="text-sm text-neutral-500">Sin resultados para <span className="text-neutral-300">"{query}"</span></p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <OfferCard
                  key={product.id}
                  offer={toOffer(product)}
                  onClick={() => navigate(`/products/${product.id}`)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </motion.div>

        <Footer />
      </div>
    </ReactLenis>
  )
}

export default ProductsView
