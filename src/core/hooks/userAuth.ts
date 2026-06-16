import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '../../features/auth/domain/models/Auth'
import { authApi }       from '../../features/auth/data/api/authApi'
import { apiClient }     from '../network/client'

export const USER_UPDATED_EVENT = 'user_data_updated'

const readUserFromStorage = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem('user_data')
    if (!stored) return null
    return JSON.parse(stored) as AuthUser
  } catch {
    return null
  }
}

export const notifyUserUpdated = () =>
  window.dispatchEvent(new Event(USER_UPDATED_EVENT))

// Respuesta de GET /users/me (UserResponse del backend, snake_case)
interface MeResponse {
  id:             number
  name:           string
  last_name:      string
  email:          string
  role_name:      string | null
  circuit_id:     number | null
  profile_image:  string | null
  dial_code:      string | null
  phone_number:   string | null
  tour_completed: boolean
}

/**
 * Sincroniza la identidad real (la que dice la cookie) contra el localStorage.
 * Evita la desincronización cookie ↔ user_data (que la UI muestre un usuario
 * mientras el backend te trata como otro). Se ejecuta una vez por carga.
 */
let synced = false
export const syncCurrentUser = async (): Promise<void> => {
  try {
    const me   = await apiClient.get<MeResponse>('/users/me')
    const prev = readUserFromStorage()
    const real: AuthUser = {
      id:              me.id,
      name:            me.name,
      last_name:       me.last_name,
      email:           me.email,
      role:            me.role_name ?? prev?.role ?? 'estudiante',
      circuit_id:      me.circuit_id,
      profile_image:   me.profile_image,
      activation_code: prev?.activation_code ?? null,
      dial_code:       me.dial_code    ?? prev?.dial_code,
      phone_number:    me.phone_number ?? prev?.phone_number,
      tour_completed:  me.tour_completed,
      oauth_provider:  prev?.oauth_provider,
    }
    localStorage.setItem('user_data', JSON.stringify(real))
    window.dispatchEvent(new Event(USER_UPDATED_EVENT))
  } catch {
    // 401 → la cookie no es válida: el apiClient ya limpia y emite session_expired
  }
}

export const useUserAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(readUserFromStorage)

  useEffect(() => {
    // Validar identidad contra la cookie una sola vez por carga (si hay sesión)
    if (!synced && readUserFromStorage()) {
      synced = true
      void syncCurrentUser()
    }

    const onUpdate  = () => setUser(readUserFromStorage())
    const onExpired = () => setUser(null)
    window.addEventListener(USER_UPDATED_EVENT, onUpdate)
    window.addEventListener('session_expired',  onExpired)
    return () => {
      window.removeEventListener(USER_UPDATED_EVENT, onUpdate)
      window.removeEventListener('session_expired',  onExpired)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignorar errores de red en logout */ }
    localStorage.removeItem('user_data')
    localStorage.removeItem('profile_image')
    setUser(null)
  }, [])

  return { user, logout }
}
