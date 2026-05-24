export interface ScheduleFermentationRequest {
  circuit_id:      number
  scheduled_start: string
  scheduled_end:   string
  initial_sugar:   number
}
