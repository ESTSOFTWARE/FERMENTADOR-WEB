import type { FermentationSession } from '../../domain/models/FermentationSession'
import type { FermentationFormData } from './FermentationFormData'

export type MainControlSectionProps = {
  isRunning:    boolean
  loading:      boolean
  showForm:     boolean
  session:      FermentationSession | null
  circuitId:    number | null
  circuitCode:  string | null
  authLoading?: boolean
  onMainToggle: () => void
  onSubmit:     (data: FermentationFormData) => void
  onCancelForm: () => void
}