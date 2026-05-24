import type { Role } from '../../models/entities/User'

export const ROLE_CONFIG: Record<Role, { color: string }> = {
  Administrador: { color: '#A78BFA' },
  Profesor:      { color: '#22C55E' },
  Estudiante:    { color: '#38BDF8' },
}
