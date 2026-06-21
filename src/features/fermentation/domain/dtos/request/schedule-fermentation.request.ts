export interface ScheduleFermentationRequest {
  circuit_id:      number
  group_id:        number | null
  scheduled_start: string
  scheduled_end:   string
  initial_sugar:   number
}
