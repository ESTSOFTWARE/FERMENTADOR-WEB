import type { FermentationStatus } from './FermentationStatus'

export interface FermentationSession {
  id:              number
  circuit_id:      number
  user_id:         number
  group_id:        number | null
  formula_id:      number
  scheduled_start: string
  scheduled_end:   string
  actual_start:    string | null
  actual_end:      string | null
  status:          FermentationStatus
  interrupted_by:  number | null
  created_at:      string | null
}
