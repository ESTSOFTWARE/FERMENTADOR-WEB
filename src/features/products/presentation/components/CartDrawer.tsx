import { AnimatePresence, motion } from 'motion/react'
import { useNavigate }             from 'react-router-dom'
import { useCartStore }            from '../../../../core/store/useCartStore'
import { useUserAuth }             from '../../../../core/hooks/userAuth'

export const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalItems } = useCartStore()
  const { user }   = useUserAuth()
  const navigate   = useNavigate()
  const total      = totalPrice()
  const count      = totalItems()

  const handleCheckout = () => {
    closeCart()
    if (!user) {
      navigate('/login', { state: { from: '/products' } })
    } else {
      // TODO: ir a pantalla de pago
      navigate('/products')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm flex flex-col bg-neutral-950 border-l border-neutral-800 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                <span className="text-white font-semibold text-sm">Carrito</span>
                {count > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  <p className="text-neutral-600 text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      style={{ background: '#1A1A1D' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                      <p className="text-xs text-neutral-500">{product.sku}</p>
                      <p className="text-sm font-bold text-green-400">
                        ${(product.price * quantity).toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                      <button
                        onClick={() => removeItem(product.id)}
                        className="p-1 rounded text-neutral-600 hover:text-red-400 transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(product.id, quantity - 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                        >−</button>
                        <span className="text-sm text-white w-5 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQty(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors disabled:opacity-30"
                        >+</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-neutral-800 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400">Total</span>
                  <span className="text-lg font-bold text-white">
                    ${total.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-green-500 text-black hover:bg-green-400 transition-colors"
                >
                  {user ? 'Finalizar compra' : 'Iniciar sesión para comprar'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
