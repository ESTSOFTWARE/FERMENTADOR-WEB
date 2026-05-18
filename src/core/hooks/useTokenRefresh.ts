import { useEffect, useCallback } from 'react'
import { authApi } from '../../features/auth/data/api/authApi'
import { notifyUserUpdated } from './userAuth'

const REFRESH_BUFFER_MS = 2 * 60 * 1000 // refresca 2 min antes de que expire

const getExpMs = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export const useTokenRefresh = (logout: () => void) => {
  const doRefresh = useCallback(async (refreshToken: string) => {
    try {
      const { access_token } = await authApi.refreshToken({ refresh_token: refreshToken })
      localStorage.setItem('access_token', access_token)
      notifyUserUpdated()
      scheduleRefresh()
    } catch {
      logout()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout])

  const scheduleRefresh = useCallback(() => {
    const accessToken  = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    if (!accessToken || !refreshToken) return

    const expMs = getExpMs(accessToken)
    if (!expMs) return

    const delay = expMs - Date.now() - REFRESH_BUFFER_MS

    if (delay <= 0) {
      doRefresh(refreshToken)
      return
    }

    const timer = setTimeout(() => doRefresh(refreshToken), delay)
    return () => clearTimeout(timer)
  }, [doRefresh])

  useEffect(() => {
    const cleanup = scheduleRefresh()
    return cleanup
  }, [scheduleRefresh])
}
