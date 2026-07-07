import { useState, useEffect } from 'react'
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl'
import { GetProductByIdUseCase } from '../../domain/usecases/get-product-by-id.usecase'
import type { Product } from '../../domain/models/Product'

import { SpecificationRepositoryImpl } from '../../../specifications/data/repositories/SpecificationRepositoryImpl'
import { GetSpecificationsUseCase }    from '../../../specifications/domain/usecases/get-specifications.usecase'

import { IncludeRepositoryImpl } from '../../../includes/data/repositories/IncludeRepositoryImpl'
import { GetIncludesUseCase }    from '../../../includes/domain/usecases/get-includes.usecase'

import { ReviewRepositoryImpl } from '../../../reviews/data/repositories/ReviewRepositoryImpl'
import { GetReviewsUseCase }    from '../../../reviews/domain/usecases/get-reviews.usecase'

import { mergeProductDetails } from '../utils/merge-product-details'

const getProductById     = new GetProductByIdUseCase(new ProductRepositoryImpl())
const getSpecifications  = new GetSpecificationsUseCase(new SpecificationRepositoryImpl())
const getIncludes        = new GetIncludesUseCase(new IncludeRepositoryImpl())
const getReviews         = new GetReviewsUseCase(new ReviewRepositoryImpl())

export const useProductDetailViewModel = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      getProductById.execute(id),
      getSpecifications.execute(id),
      getIncludes.execute(id),
      getReviews.execute(id, 1, 10),
    ])
      .then(([baseProduct, specs, includes, reviewPage]) => {
        if (cancelled) return
        setProduct(mergeProductDetails(baseProduct, specs, includes, reviewPage))
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar el producto.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}