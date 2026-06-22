import { useEffect, useState } from 'react'
import { adminsApi }           from '../../data/api/adminsApi'
import type { Admin }          from '../../domain/models/Admin'

/**
 * Carga la lista de administradores (GET /api/support/admins) para el panel
 * de Usuarios del dashboard de soporte.
 */
export const useAdminsViewModel = () => {
  const [admins,  setAdmins]  = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    let active = true
    adminsApi.getAll()
      .then(data => { if (active) setAdmins(data) })
      .catch(()  => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return { admins, loading, error }
}
