export interface ChangePasswordRequest {
  current_password: string
  new_password:     string
  confirm_password: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface UpdateUserRequest {
  name?:          string
  last_name?:     string
  email?:         string
  password?:      string
  profile_image?: string
  dial_code?:     string
  phone_number?:  string
}

export interface ActivateCircuitRequest {
  activation_code: string
}

export interface ActivateCircuitResponse {
  access_token: string
  token_type:   string
  circuit_id:   number
}

export interface UserProfile {
  id:            number
  name:          string
  last_name:     string
  email:         string
  role_id:       number
  role_name:     string | null
  circuit_id:    number | null
  created_by:    number | null
  created_at:    string | null
  profile_image:  string | null
  dial_code:      string | null
  phone_number:   string | null
  tour_completed: boolean
}