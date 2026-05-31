import { useState, useEffect }       from 'react'
import { ProductRepositoryImpl }     from '../../data/repositories/ProductRepositoryImpl'
import { GetProductByIdUseCase }     from '../../domain/usecases/get-product-by-id.usecase'
import type { Product }              from '../../domain/models/Product'

const getProductById = new GetProductByIdUseCase(new ProductRepositoryImpl())

export const useProductDetailViewModel = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    getProductById.execute(id)
      .then(setProduct)
      .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar el producto.'))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}
