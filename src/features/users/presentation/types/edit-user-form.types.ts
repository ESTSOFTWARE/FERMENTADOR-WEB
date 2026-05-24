import type { Role } from '../../models/entities/User'

export type EditUserForm = {
  name:       string
  last_name:  string
  email:      string
  role_name:  Role
  circuit_id: string
}
