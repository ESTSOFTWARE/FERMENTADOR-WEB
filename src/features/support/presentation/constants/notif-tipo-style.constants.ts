import type { NotifType } from '../types/notif-type.types'

export const NOTIF_TIPO_STYLE: Record<NotifType, { dot: string; bg: string; label: string }> = {
  ticket:      { dot: 'bg-amber-400', bg: 'bg-amber-400/10', label: 'Chat'        },
  fermentador: { dot: 'bg-red-400',   bg: 'bg-red-400/10',   label: 'Fermentador' },
  sistema:     { dot: 'bg-blue-400',  bg: 'bg-blue-400/10',  label: 'Sistema'     },
  usuario:     { dot: 'bg-green-400', bg: 'bg-green-400/10', label: 'Usuario'     },
}
