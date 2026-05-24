import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { ProfileRepositoryImpl }      from '../../features/profile/data/repositories/ProfileRepositoryImpl'
import { GetUserProfileUseCase }      from '../../features/profile/domain/usecases/get-user-profile.usecase'
import { MarkTourCompletedUseCase }   from '../../features/profile/domain/usecases/mark-tour-completed.usecase'
import { useUserAuth }                from './userAuth'

const profileRepo    = new ProfileRepositoryImpl()
const getUserProfile = new GetUserProfileUseCase(profileRepo)
const markTour       = new MarkTourCompletedUseCase(profileRepo)

interface TourStep {
  path:    string | null
  element: string
  title:   string
  desc:    string
}

// Orden visual real del sidebar:
// soloItems primero (sin grupo), luego grupos
// soloItems en orden del nav: Inicio, Visualizar Gráficas, Calculadora,
//   Iniciar Fermentación, Reportes, Comunicados, Chat
// grupos: Experimentar con IA, Gestión de Usuarios
const STEPS: TourStep[] = [
  {
    path:    '/overview',
    element: '#tour-step-logo',
    title:   '¡Bienvenido a Fermest!',
    desc:    'Te mostraremos cada sección del panel para que conozcas la plataforma. Puedes saltar el tour en cualquier momento.',
  },
  {
    path:    null,
    element: '#tour-step-inicio',
    title:   'Inicio',
    desc:    'Tu punto de partida. Aquí ves los anuncios destacados, el estado de la plataforma y un resumen de la actividad reciente.',
  },
  {
    path:    '/grafics',
    element: '#tour-step-grafics',
    title:   'Visualizar Gráficas',
    desc:    'Accede a las gráficas de cualquier experimento anterior de forma interactiva, filtrando por circuito, fecha o parámetros.',
  },
  {
    path:    '/efficiency-calculator',
    element: '#tour-step-efficiency',
    title:   'Calculadora de Eficiencia',
    desc:    'Calcula manualmente la eficiencia de fermentación a partir de datos de entrada sin necesidad de correr un experimento completo.',
  },
  {
    path:    '/fermentation',
    element: '#tour-step-fermentation',
    title:   'Iniciar Fermentación',
    desc:    'Arranca una nueva sesión de fermentación en tiempo real. El sistema monitorea temperatura, pH y otros sensores del circuito conectado.',
  },
  {
    path:    '/fermentation-reports',
    element: '#tour-step-reports',
    title:   'Reportes de Fermentación',
    desc:    'Consulta el historial completo de sesiones: duración, parámetros registrados y resultados obtenidos en cada proceso.',
  },
  {
    path:    '/announcements',
    element: '#tour-step-announcements',
    title:   'Comunicados',
    desc:    'Revisa los avisos y novedades publicados por el equipo. Los comunicados fijados aparecen siempre en la parte superior.',
  },
  {
    path:    '/chat',
    element: '#tour-step-chat',
    title:   'Chat IA — FermestBot',
    desc:    'Habla con FermestBot, el asistente de inteligencia artificial. Puedes preguntarle sobre fermentación, experimentos o el uso de la plataforma.',
  },
  {
    path:    '/groups',
    element: '#tour-step-groups',
    title:   'Mis Grupos',
    desc:    'Crea grupos o clases, define la materia y sube una imagen de portada. Añade alumnos buscando por nombre o correo. Cada grupo genera un código QR único para que los estudiantes se unan desde la app móvil.',
  },
  {
    path:    '/admin/groups',
    element: '#tour-step-admin-groups',
    title:   'Ver Grupos',
    desc:    'Como administrador puedes ver todos los grupos creados por los profesores: nombre, materia, código, docente a cargo y alumnos inscritos.',
  },
  // ── Grupo: Experimentar con IA ──────────────────────────────────────
  {
    path:    '/dashboard',
    element: '#tour-step-dashboard',
    title:   'Nuevo Experimento',
    desc:    'Configura los parámetros de fermentación: temperatura, pH, tiempo y más. La IA usará estos datos para optimizar la fórmula de eficiencia.',
  },
  {
    path:    null,
    element: '#tour-step-results',
    title:   'Resultados del Experimento',
    desc:    'Una vez que corres un experimento, aquí verás el resumen completo: el mejor individuo encontrado, su eficiencia y los parámetros ganadores.',
  },
  {
    path:    null,
    element: '#tour-step-generaciones',
    title:   'Generaciones',
    desc:    'Explora todos los individuos generados por el algoritmo genético, generación por generación, con sus valores de aptitud y parámetros.',
  },
  {
    path:    null,
    element: '#tour-step-mejor',
    title:   'Mejor por Generación',
    desc:    'Sigue la evolución del mejor individuo de cada generación y visualiza cómo mejora la eficiencia a lo largo del proceso.',
  },
  {
    path:    null,
    element: '#tour-step-graficas',
    title:   'Gráficas del Experimento',
    desc:    'Visualizaciones completas de la corrida: curvas de convergencia, distribución de parámetros y comparativas entre generaciones.',
  },
  {
    path:    null,
    element: '#tour-step-simulacion',
    title:   'Simulación',
    desc:    'Reproduce la curva de fermentación del mejor individuo encontrado y compárala con datos reales del proceso.',
  },
  // ── Grupo: Gestión de Usuarios ──────────────────────────────────────
  {
    path:    '/users/add',
    element: '#tour-step-users-add',
    title:   'Agregar Usuarios',
    desc:    'Registra nuevos usuarios en la plataforma asignándoles un rol (estudiante o profesor) y vinculándolos a tu circuito.',
  },
  {
    path:    null,
    element: '#tour-step-users-manage',
    title:   'Administrar Usuarios',
    desc:    'Consulta, edita o elimina los usuarios que has creado. También puedes ver su estado de activación y asignarles circuitos.',
  },
  // ── Fin del tour ────────────────────────────────────────────────────
  {
    path:    '/overview',
    element: '#tour-step-profile',
    title:   'Tu perfil y notificaciones',
    desc:    '¡Ya conoces todo el panel! Desde aquí gestionas tu cuenta, cambias tu foto y revisas las notificaciones del sistema.',
  },
]

export const useTour = () => {
  const { user }  = useUserAuth()
  const navigate  = useNavigate()
  const started   = useRef(false)

  useEffect(() => {
    if (!user?.id || started.current) return

    getUserProfile.execute(user.id).then(profile => {
      if (profile.tour_completed) return

      started.current = true
      document.body.classList.add('tour-active')

      const goTo = (index: number, cb: () => void) => {
        const path = STEPS[index]?.path
        if (path && window.location.pathname !== path) {
          navigate(path)
          setTimeout(cb, 500)
        } else {
          setTimeout(cb, 80)
        }
      }

      const driverObj = driver({
        showProgress:   true,
        animate:        true,
        overlayOpacity: 0.5,
        stagePadding:   6,
        popoverClass:   'fermest-tour',
        nextBtnText:    'Siguiente →',
        prevBtnText:    '← Atrás',
        doneBtnText:    '¡Listo!',
        progressText:   '{{current}} de {{total}}',
        steps: STEPS.map(s => ({
          element: s.element,
          popover: {
            title:       s.title,
            description: s.desc,
            side:        s.element === '#tour-step-profile' ? 'left' : 'right',
            align:       'start',
          },
        })),
        onNextClick: () => {
          const current = driverObj.getActiveIndex() ?? 0
          const next    = current + 1
          if (next >= STEPS.length) {
            driverObj.destroy()
            return
          }
          goTo(next, () => driverObj.moveNext())
        },
        onPrevClick: () => {
          const current = driverObj.getActiveIndex() ?? 0
          const prev    = current - 1
          if (prev < 0) return
          goTo(prev, () => driverObj.movePrevious())
        },
        onDestroyed: () => {
          document.body.classList.remove('tour-active')
          markTour.execute().catch(() => {})
        },
      })

      // navegar a /overview y luego arrancar
      if (window.location.pathname !== '/overview') {
        navigate('/overview')
        setTimeout(() => driverObj.drive(), 700)
      } else {
        setTimeout(() => driverObj.drive(), 600)
      }
    }).catch(() => {})
  }, [user?.id, navigate])
}
