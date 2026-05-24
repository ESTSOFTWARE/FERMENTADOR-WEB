export interface FermentationReport {
  id:                          number
  session_id:                  number
  initial_sugar:               number
  final_sugar:                 number | null
  ethanol_detected:            number | null
  theoretical_ethanol:         number | null
  efficiency:                  number | null
  alcohol_initial:             number | null
  alcohol_final:               number | null
  alcohol_deactivated_at:      string | null
  alcohol_last_reading:        number | null
  density_initial:             number | null
  density_final:               number | null
  density_deactivated_at:      string | null
  density_last_reading:        number | null
  conductivity_initial:        number | null
  conductivity_final:          number | null
  conductivity_deactivated_at: string | null
  conductivity_last_reading:   number | null
  ph_initial:                  number | null
  ph_final:                    number | null
  ph_deactivated_at:           string | null
  ph_last_reading:             number | null
  temperature_initial:         number | null
  temperature_final:           number | null
  temperature_deactivated_at:  string | null
  temperature_last_reading:    number | null
  turbidity_initial:           number | null
  turbidity_final:             number | null
  turbidity_deactivated_at:    string | null
  turbidity_last_reading:      number | null
  rpm_initial:                 number | null
  rpm_final:                   number | null
  rpm_deactivated_at:          string | null
  rpm_last_reading:            number | null
  notes:                       string | null
  generated_at:                string | null
}
