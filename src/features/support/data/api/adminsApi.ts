import { apiClient }    from '../../../../core/network/client'
import type { Admin }   from '../../domain/models/Admin'

// Solo soporte puede consultar la lista de administradores (role_id = 1).
export const adminsApi = {
  getAll: () => apiClient.get<Admin[]>('/support/admins'),
}
