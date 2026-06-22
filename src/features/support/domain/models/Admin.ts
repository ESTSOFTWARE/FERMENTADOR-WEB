// Usuario administrador devuelto por GET /api/support/admins (role_id = 1).
export interface AdminRole {
  id:   number
  name: string
}

export interface AdminCircuit {
  id:          number | null
  code:        string | null
  has_circuit: boolean
}

export interface AdminPhone {
  dial_code: string | null
  number:    string | null
}

export interface Admin {
  id:            number
  name:          string
  last_name:     string
  email:         string
  role:          AdminRole
  circuit:       AdminCircuit
  auth_provider: string
  profile_image: string | null
  phone:         AdminPhone
  created_at:    string | null
}
