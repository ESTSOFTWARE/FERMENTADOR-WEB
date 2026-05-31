import * as React from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Tag, ShoppingCart } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface Offer {
  id:           string | number
  imageSrc:     string
  imageAlt:     string
  tag:          string
  title:        string
  description:  string
  brandLogoSrc: string
  brandName:    string
  promoCode?:   string
  href:         string
}

interface OfferCardProps {
  offer:         Offer
  onClick?:      (e: React.MouseEvent) => void
  onAddToCart?:  (e: React.MouseEvent) => void
  className?:    string
}

export const OfferCard = React.forwardRef<HTMLDivElement, OfferCardProps>(
  ({ offer, onClick, onAddToCart, className }, ref) => (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={cn('relative flex-shrink-0 w-full h-[380px] rounded-2xl overflow-hidden group cursor-pointer', className)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img
        src={offer.imageSrc}
        alt={offer.imageAlt}
        className="absolute inset-0 w-full h-1/2 object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col justify-between p-5"
        style={{ background: '#111113', borderTop: '1px solid #2A2A2D' }}>

        <div className="space-y-1.5">
          <div className="flex items-center text-xs" style={{ color: '#71717A' }}>
            <Tag className="w-3.5 h-3.5 mr-1.5" style={{ color: '#22C55E' }} />
            <span>{offer.tag}</span>
          </div>
          <h3 className="text-base font-bold leading-tight" style={{ color: '#F4F4F5' }}>
            {offer.title}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#71717A' }}>
            {offer.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #2A2A2D' }}>
          <div className="flex items-center gap-2.5">
            <img src={offer.brandLogoSrc} alt={offer.brandName}
              className="w-7 h-7 rounded-full object-cover"
              style={{ background: '#2A2A2D' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <div>
              <p className="text-xs font-semibold" style={{ color: '#F4F4F5' }}>{offer.brandName}</p>
              {offer.promoCode && (
                <p className="text-[11px]" style={{ color: '#71717A' }}>{offer.promoCode}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart(e) }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'transparent', color: '#22C55E', border: 'none' }}
                title="Agregar al carrito"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:-rotate-45"
              style={{ background: '#1A1A1D', color: '#22C55E' }}>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
)
OfferCard.displayName = 'OfferCard'

export interface OfferGridProps extends React.HTMLAttributes<HTMLDivElement> {
  offers: Offer[]
}

const OfferGrid = React.forwardRef<HTMLDivElement, OfferGridProps>(
  ({ offers, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5', className)}
      {...props}
    >
      {offers.map(offer => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  )
)
OfferGrid.displayName = 'OfferGrid'

export { OfferGrid }
