export interface FermentationFormData {
  scheduled_start: string
  scheduled_end:   string
  initial_sugar:   number
  group_id:        number | null
}