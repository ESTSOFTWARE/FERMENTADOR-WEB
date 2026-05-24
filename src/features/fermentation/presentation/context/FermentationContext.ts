import { createContext }                   from 'react'
import type { FermentationContextValue }  from '../types/fermentation-context-value.types'

export const FermentationContext = createContext<FermentationContextValue | null>(null)
