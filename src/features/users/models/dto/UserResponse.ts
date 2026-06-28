export interface UserResponse {
  id:            number
  name:          string
  last_name:     string
  email:         string
  role_id:       number
  role_name:     string | null
  circuit_id:    number | null
  circuit_code:  string | null
  created_by:    number | null
  created_at:    string | null
  profile_image: string | null
}