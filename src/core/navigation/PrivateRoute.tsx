import { Navigate, Outlet } from 'react-router-dom'
import { useUserAuth } from '../hooks/userAuth'

interface PrivateRouteProps {
  allowedRoles?: string[]
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user } = useUserAuth()

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role?.toLowerCase() === 'soporte' ? '/support' : '/overview'} replace />
  }

  // Soporte no tiene acceso al Layout general
  if (!allowedRoles && user.role?.toLowerCase() === 'soporte') {
    return <Navigate to="/support" replace />
  }

  return <Outlet />
}

export default PrivateRoute
