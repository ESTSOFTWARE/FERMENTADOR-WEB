import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '../../features/auth/domain/models/Auth'

export const USER_UPDATED_EVENT = 'user_data_updated'

const parseJwt = (token: string) => {
  try { return JSON.parse(atob(token.split('.')[1])) }
  catch { return null }
}

const readUserFromStorage = (): AuthUser | null => {
  const token = localStorage.getItem('access_token')
  if (!token) return null

  const stored = localStorage.getItem('user_data')
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AuthUser
      // Siempre combinar con el JWT actual para tener circuit_id fresco
      const payload = parseJwt(token)
      return {
        ...parsed,
        circuit_id:    payload?.circuit_id ?? parsed.circuit_id ?? null,
        profile_image: parsed.profile_image ?? localStorage.getItem('profile_image') ?? null,
      }
    } catch { /* fallback */ }
  }

  const payload = parseJwt(token)
  if (!payload) return null
  return {
    id:            Number(payload.sub),
    name:          '',
    last_name:     '',
    email:         '',
    role:          payload.role       ?? 'estudiante',
    circuit_id:    payload.circuit_id ?? null,
    profile_image: null,
    activation_code: payload.activation_code ?? null,
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

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }, [])

  return { user, token: localStorage.getItem('access_token'), logout }
}