import { useEffect, useCallback }     from 'react'
import { AuthRepositoryImpl }         from '../../features/auth/data/repositories/AuthRepositoryImpl'
import { RefreshTokenUseCase }        from '../../features/auth/domain/usecases/refresh-token.usecase'

// Access token expires in 60 min — refresh 5 min before expiry
const REFRESH_INTERVAL_MS = 55 * 60 * 1000

const refreshUseCase = new RefreshTokenUseCase(new AuthRepositoryImpl())

export const useTokenRefresh = (logout: () => void) => {
  const doRefresh = useCallback(async () => {
    try {
      await refreshUseCase.execute()
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    const interval = setInterval(doRefresh, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [doRefresh])
}
