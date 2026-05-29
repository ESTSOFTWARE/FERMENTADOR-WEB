import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '../../features/auth/domain/models/Auth'
import { authApi }       from '../../features/auth/data/api/authApi'

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

export const useUserAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(readUserFromStorage)

  useEffect(() => {
    const handler = () => setUser(readUserFromStorage())
    window.addEventListener(USER_UPDATED_EVENT, handler)
    return () => window.removeEventListener(USER_UPDATED_EVENT, handler)
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch { /* ignorar errores de red en logout */ }
    localStorage.removeItem('user_data')
    localStorage.removeItem('profile_image')
    setUser(null)
  }, [])

  return { user, logout }
}
