export interface AuthUser {
  id:              number
  name:            string
  last_name:       string
  email:           string
  role:            string
  circuit_id:      number | null
  profile_image:   string | null
  activation_code: string | null
  dial_code?:      string
  phone_number?:   string
  description?:    string | null
  tour_completed?: boolean
  oauth_provider?: 'google' | 'github' | 'email'
  created_at?:     string | null
}