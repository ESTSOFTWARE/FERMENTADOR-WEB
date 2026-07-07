import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { ReviewRepositoryImpl }             from '../../data/repositories/ReviewRepositoryImpl'
import { GetReviewsUseCase }                from '../../domain/usecases/get-reviews.usecase'
import { CreateReviewUseCase }              from '../../domain/usecases/create-review.usecase'
import { DeleteReviewUseCase }              from '../../domain/usecases/delete-review.usecase'
import type { Review }                      from '../../domain/models/Review'
import type { CreateReviewRequest }         from '../../domain/dtos/request/create-review.request'
import { TOAST_STYLE }                      from '../../../components/presentation/constants/toast-style.constants'

const repo         = new ReviewRepositoryImpl()
const getReviews    = new GetReviewsUseCase(repo)
const createReview   = new CreateReviewUseCase(repo)
const deleteReview   = new DeleteReviewUseCase(repo)

export const useReviewsViewModel = (productId: number, limit = 10) => {
  const [reviews,       setReviews]       = useState<Review[]>([])
  const [total,         setTotal]         = useState(0)
  const [page,          setPage]          = useState(1)
  const [averageRating, setAverageRating] = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)

  const load = useCallback(async (targetPage: number) => {
    try {
      setLoading(true)
      setError(null)
      const result = await getReviews.execute(productId, targetPage, limit)
      setReviews(result.items)
      setTotal(result.total)
      setAverageRating(result.averageRating)
      setPage(result.page)
    } catch (e) {
      setError((e as Error).message)
      sileo.error({ title: 'Error al cargar reseñas', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [productId, limit])

  useEffect(() => { load(1) }, [load])

  const create = useCallback(async (data: CreateReviewRequest) => {
    try {
      await createReview.execute(productId, data)
      sileo.success({ title: 'Reseña publicada', ...TOAST_STYLE })
      await load(1)
    } catch (e) {
      sileo.error({ title: 'No se pudo publicar la reseña', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId, load])

  const remove = useCallback(async (reviewId: number) => {
    try {
      await deleteReview.execute(productId, reviewId)
      sileo.success({ title: 'Reseña eliminada', ...TOAST_STYLE })
      await load(page)
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId, page, load])

  return { reviews, total, page, averageRating, loading, error, create, remove, goToPage: load }
}