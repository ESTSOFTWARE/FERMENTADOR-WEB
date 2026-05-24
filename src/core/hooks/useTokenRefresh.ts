import { useEffect, useCallback }        from 'react'
import { AuthRepositoryImpl }            from '../../features/auth/data/repositories/AuthRepositoryImpl'
import { RefreshTokenUseCase }           from '../../features/auth/domain/usecases/refresh-token.usecase'
import { notifyUserUpdated }             from './userAuth'

const refreshToken = new RefreshTokenUseCase(new AuthRepositoryImpl())

const REFRESH_BUFFER_MS = 2 * 60 * 1000

const getExpMs = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export const useTokenRefresh = (logout: () => void) => {
  const doRefresh = useCallback(async (token: string) => {
    try {
      await refreshToken.execute(token)
      notifyUserUpdated()
      scheduleRefresh()
    } catch {
      logout()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout])

  const scheduleRefresh = useCallback(() => {
    const accessToken        = localStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    if (!accessToken || !storedRefreshToken) return

    const expMs = getExpMs(accessToken)
    if (!expMs) return

    const delay = expMs - Date.now() - REFRESH_BUFFER_MS

    if (delay <= 0) {
      doRefresh(storedRefreshToken)
      return
    }

    const timer = setTimeout(() => doRefresh(storedRefreshToken), delay)
    return () => clearTimeout(timer)
  }, [doRefresh])

  useEffect(() => {
    const cleanup = scheduleRefresh()
    return cleanup
  }, [scheduleRefresh])
}
