import type { NotifType } from './notif-type.types'

export interface Notificacion {
  id:          string
  tipo:        NotifType
  titulo:      string
  descripcion: string
  leida:       boolean
  creadoEn:    string
}
