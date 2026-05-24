import type { CodigoStatus } from './codigo-status.types'
import type { Responsable }  from './responsable.types'

export interface Fermentador {
  id:            string
  serial:        string
  codigoStatus:  CodigoStatus
  codigo:        string
  vendido:       boolean
  clienteNombre: string | null
  creadoEn:      string
  altaPor:       Responsable
}
