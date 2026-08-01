import { Navigate, Outlet } from 'react-router-dom'
import { useEntitlements } from '../hooks/useEntitlements'

interface Props {
  feature:  string
  redirect?: string
}

/**
 * Guard de ruta por feature del plan. Si el plan del usuario no incluye
 * `feature`, redirige (por defecto a /actualizar). Mientras se resuelve el
 * plan real no redirige, para no rebotar a un usuario con plan pagado.
 */
const RequireFeature = ({ feature, redirect = '/actualizar' }: Props) => {
  const { hasFeature, loading } = useEntitlements()

  if (loading) return null
  if (!hasFeature(feature)) return <Navigate to={redirect} replace />
  return <Outlet />
}

export default RequireFeature
