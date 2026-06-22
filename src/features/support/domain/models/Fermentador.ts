export type FermentadorEstado = 'disponible' | 'asignado' | 'inactivo'

// Fermentador devuelto por GET /api/fermentadores.
export interface Fermentador {
  id:             number
  serial:         string
  circuit_id:     number | null
  codigo:         string | null
  vendido:        boolean
  estado:         FermentadorEstado
  cliente_id:     number | null
  cliente_nombre: string | null
  alta_por:       string | null
  created_at:     string | null
}
