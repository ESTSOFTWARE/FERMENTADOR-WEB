import { create } from 'zustand'
import type { Product } from '../../features/products/domain/models/Product'

export interface CartItem {
  product:  Product
  quantity: number
}

interface CartStore {
  items:       CartItem[]
  isOpen:      boolean
  addItem:     (product: Product) => void
  removeItem:  (productId: number) => void
  updateQty:   (productId: number, qty: number) => void
  clearCart:   () => void
  openCart:    () => void
  closeCart:   () => void
  totalItems:  () => number
  totalPrice:  () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items:  [],
  isOpen: false,

  addItem: (product) => set(s => {
    const existing = s.items.find(i => i.product.id === product.id)
    if (existing) {
      return {
        items: s.items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    }
    return { items: [...s.items, { product, quantity: 1 }] }
  }),

  removeItem: (productId) => set(s => ({
    items: s.items.filter(i => i.product.id !== productId),
  })),

  updateQty: (productId, qty) => set(s => ({
    items: qty <= 0
      ? s.items.filter(i => i.product.id !== productId)
      : s.items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i),
  })),

  clearCart:  () => set({ items: [] }),
  openCart:   () => set({ isOpen: true }),
  closeCart:  () => set({ isOpen: false }),
  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  totalPrice: () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
}))
