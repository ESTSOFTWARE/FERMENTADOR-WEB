import { useState, useEffect }       from 'react'
import { ProductRepositoryImpl }     from '../../data/repositories/ProductRepositoryImpl'
import { GetProductsUseCase }        from '../../domain/usecases/get-products.usecase'
import type { Product }              from '../../domain/models/Product'

const getProducts = new GetProductsUseCase(new ProductRepositoryImpl())

export const useProductsViewModel = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    getProducts.execute()
      .then(setProducts)
      .catch(err => setError(err instanceof Error ? err.message : 'Error al cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}
