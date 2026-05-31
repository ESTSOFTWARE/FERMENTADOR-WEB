import { useNavigate }  from 'react-router-dom'
import { motion }       from 'motion/react'
import { StarRating }   from './StarRating'
import type { Product } from '../../domain/models/Product'

interface Props { product: Product; index: number }

export const ProductCard = ({ product, index }: Props) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 80, damping: 18 }}
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        background:    '#111113',
        border:        '1px solid #2A2A2D',
        borderRadius:  16,
        padding:       24,
        display:       'flex',
        flexDirection: 'column',
        gap:           12,
        cursor:        'pointer',
        transition:    'border-color 200ms',
      }}
      whileHover={{ scale: 1.01 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
          {product.name}
        </h3>
        <span style={{ color: '#71717A', fontSize: 11, fontFamily: 'monospace', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {product.sku}
        </span>
      </div>

      <p style={{ color: '#71717A', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {product.description}
      </p>

      <div style={{ height: 1, background: '#2A2A2D' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#22C55E', fontSize: 18, fontWeight: 700 }}>
          ${product.price.toFixed(2)} MXN
        </span>
        <StarRating rating={product.rating} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: product.stock > 0 ? '#22C55E' : '#EF4444',
          flexShrink: 0,
        }} />
        <span style={{ color: '#71717A', fontSize: 12 }}>
          {product.stock > 0 ? `Disponible: ${product.stock} unidades` : 'Sin stock'}
        </span>
      </div>
    </motion.div>
  )
}
