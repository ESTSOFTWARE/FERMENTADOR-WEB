import { useCallback, useState } from 'react'
import { sileo } from 'sileo'
import { reviewsApi } from '../../../components/data/api/reviewsApi'
import { TOAST_STYLE } from '../../../components/presentation/constants/toast-style.constants'

export const useDeleteReviewViewModel = (productId: number, onSuccess?: () => void) => {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const remove = useCallback(async (reviewId: number) => {
    try {
      setDeletingId(reviewId)
      await reviewsApi.delete(productId, reviewId)
      sileo.success({ title: 'Reseña eliminada', description: 'Tu reseña fue eliminada correctamente.', ...TOAST_STYLE })
      onSuccess?.()
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar tu reseña', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setDeletingId(null)
    }
  }, [productId, onSuccess])

  return { deletingId, remove }
}