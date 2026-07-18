import { useCallback, useState } from 'react'
import { sileo } from 'sileo'
import { reviewsApi } from '../../../components/data/api/reviewsApi'
import { TOAST_STYLE } from '../../../components/presentation/constants/toast-style.constants'

export const useLeaveReviewViewModel = (productId: number, onSuccess?: () => void) => {
  const [open, setOpen]       = useState(false)
  const [rating, setRating]   = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving]   = useState(false)

  const submit = useCallback(async () => {
    if (rating < 1) {
      sileo.error({ title: 'Selecciona una calificación', description: 'Elige de 1 a 5 estrellas.', ...TOAST_STYLE })
      return
    }
    try {
      setSaving(true)
      await reviewsApi.create(productId, { rating, comment: comment.trim() || null })
      sileo.success({ title: '¡Gracias por tu reseña!', description: 'Tu opinión ya es visible para otros usuarios.', ...TOAST_STYLE })
      setOpen(false); setRating(0); setComment('')
      onSuccess?.()
    } catch (e) {
      // Cubre entre otros: ReviewAlreadyExistsException ("ya calificaste este producto")
      sileo.error({ title: 'No se pudo enviar tu reseña', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setSaving(false)
    }
  }, [productId, rating, comment, onSuccess])

  return { open, setOpen, rating, setRating, comment, setComment, saving, submit }
}