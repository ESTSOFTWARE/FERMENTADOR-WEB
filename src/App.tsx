import { Toaster } from 'sileo'
import AppRouter from './core/navigation/AppRouter'
import { useTokenRefresh } from './core/hooks/useTokenRefresh'
import { useUserAuth } from './core/hooks/userAuth'

const App = () => {
  const { logout } = useUserAuth()
  useTokenRefresh(logout)

  return (
    <>
      <Toaster position="top-center" />
      <AppRouter />
    </>
  )
}

export default App
