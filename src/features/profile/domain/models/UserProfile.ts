export interface UserProfile {
  id:             number
  name:           string
  last_name:      string
  email:          string
  role_id:        number
  role_name:      string | null
  circuit_id:     number | null
  created_by:     number | null
  created_at:     string | null
  profile_image:  string | null
  dial_code:      string | null
  phone_number:   string | null
  tour_completed: boolean
}
