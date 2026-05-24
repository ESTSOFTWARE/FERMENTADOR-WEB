import { useContext }                     from 'react'
import { FermentationContext }            from '../context/FermentationContext'
import type { FermentationContextValue }  from '../types/fermentation-context-value.types'

export const useFermentation = (): FermentationContextValue => {
  const ctx = useContext(FermentationContext)
  if (!ctx) throw new Error('useFermentation debe usarse dentro de <FermentationProvider>')
  return ctx
}
