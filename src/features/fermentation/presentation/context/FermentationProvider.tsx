import type { ReactNode }               from 'react'
import { FermentationContext }           from './FermentationContext'
import { useFermentationViewModel }      from '../viewmodels/useFermentationViewModel'

export const FermentationProvider = ({ children }: { children: ReactNode }) => {
  const value = useFermentationViewModel()
  return (
    <FermentationContext.Provider value={value}>
      {children}
    </FermentationContext.Provider>
  )
}
