// ── Request types ─────────────────────────────────────────────────────────────
export interface LoginRequest {
  email:    string
  password: string
}

export interface RegisterRequest {
  name:      string
  last_name: string
  email:     string
  password:  string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

// ── Response types ────────────────────────────────────────────────────────────
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
  tour_completed?: boolean
}

export interface TokenResponse {
  access_token:  string
  refresh_token: string
  token_type:    string
  user:          AuthUser
}

export interface AccessTokenResponse {
  access_token: string
  token_type:   string
}

export interface RegisterResponse {
  id:        number
  name:      string
  last_name: string
  email:     string
  role:      string
}