import type { QuickAction } from '../types/quick-action.types'

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label:        'Nuevo Experimento',
    description:  'Configura y ejecuta el algoritmo genético',
    path:         '/dashboard',
    color:        '#22C55E',
    allowedRoles: ['admin', 'profesor'],
    icon:         'M12 4v16m8-8H4',
  },
  {
    label:        'Iniciar Fermentación',
    description:  'Activa sensores y controla el proceso',
    path:         '/fermentation',
    color:        '#3B82F6',
    allowedRoles: ['admin', 'profesor'],
    icon:         'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    label:        'Visualizar Sensores',
    description:  'Monitoreo en tiempo real vía WebSocket',
    path:         '/grafics',
    color:        '#F59E0B',
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon:         'M3 3v18h18M7 16l4-4 4 4 4-8',
  },
  {
    label:        'Chat IA',
    description:  'Consulta al asistente FermestBot',
    path:         '/chat',
    color:        '#A78BFA',
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon:         'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
]
