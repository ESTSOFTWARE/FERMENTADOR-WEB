import type { StatItem } from '../types/stat-item.types'

export const STATS: StatItem[] = [
  {
    label:        'Fermentaciones',
    description:  'Historial de sesiones registradas',
    color:        '#3B82F6',
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon:         'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    label:        'Sensores activos',
    description:  '4 sensores conectados actualmente',
    color:        '#F59E0B',
    allowedRoles: ['admin', 'docente', 'estudiante'],
    icon:         'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  },
  {
    label:        'Experimentos',
    description:  'Experimentos con algoritmo genético',
    color:        '#22C55E',
    allowedRoles: ['admin', 'profesor'],
    icon:         'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
]
