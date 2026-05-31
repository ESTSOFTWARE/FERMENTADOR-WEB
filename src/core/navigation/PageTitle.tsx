import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const APP_NAME = 'Nich-Ká'

const TITLES: Record<string, string> = {
  '/':                     'Nich-Ká',
  '/privacy':              'Privacidad',
  '/terms':                'Términos',
  '/cookies':              'Cookies',
  '/hardware':             'Hardware',
  '/planes':               'Planes',
  '/consultoria':          'Consultoría',
  '/mantenimiento':        'Mantenimiento',
  '/products':             'Catálogo',
  '/login':                'Iniciar sesión',
  '/register':             'Registrarse',
  '/forgot-password':      'Recuperar contraseña',
  '/support':              'Soporte',
  '/overview':             'Inicio',
  '/grafics':              'Sensores',
  '/efficiency-calculator':'Calculadora',
  '/fermentation-reports': 'Reportes',
  '/chat':                 'Chat',
  '/announcements':        'Comunicados',
  '/profile':              'Perfil',
  '/dashboard':            'Dashboard',
  '/fermentation':         'Fermentación',
  '/users/add':            'Agregar usuario',
  '/users/manage':         'Usuarios',
  '/groups':               'Grupos',
  '/admin/groups':         'Grupos',
}

const resolve = (pathname: string): string => {
  if (TITLES[pathname]) return TITLES[pathname]
  // rutas dinámicas
  if (/^\/products\/\d+/.test(pathname))           return 'Producto'
  if (/^\/experiment\/.+\/charts/.test(pathname))  return 'Gráficas'
  if (/^\/experiment\/.+\/best-per-generation/.test(pathname)) return 'Experimento'
  if (/^\/experiment\//.test(pathname))            return 'Experimento'
  if (/^\/simulation\//.test(pathname))            return 'Simulación'
  if (/^\/results\//.test(pathname))               return 'Resultados'
  if (/^\/groups\//.test(pathname))                return 'Grupo'
  return ''
}

const PageTitle = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const title = resolve(pathname)
    document.title = title || APP_NAME
  }, [pathname])

  return null
}

export default PageTitle
