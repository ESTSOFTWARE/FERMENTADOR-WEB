import { useState, useEffect, useCallback } from 'react'
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl'
import { GetProductByIdUseCase } from '../../domain/usecases/get-product-by-id.usecase'
import type { Product } from '../../domain/models/Product'

const getProductById = new GetProductByIdUseCase(new ProductRepositoryImpl())

export const useProductDetailViewModel = (id: number) => {
  const [product, setProduct]     = useState<Product | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.resolve()
      .then(() => {
        if (cancelled) return undefined
        setLoading(true)
        setError(null)
        return getProductById.execute(id)
      })
      .then(result => { if (!cancelled && result) setProduct(result) })
      .catch(err => { if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar el producto.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id, reloadKey])

  const reload = useCallback(() => setReloadKey(k => k + 1), [])

  return { product, loading, error, reload }
}