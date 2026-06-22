import type { FermentadorEstado } from '../../domain/models/Fermentador'

export const ESTADO_STYLE: Record<FermentadorEstado, { label: string; dot: string; text: string; border: string }> = {
  asignado:   { label: 'Asignado',   dot: 'bg-green-400',   text: 'text-green-400',   border: 'border-green-500/60' },
  disponible: { label: 'Disponible', dot: 'bg-blue-400',    text: 'text-blue-400',    border: 'border-blue-500/60'  },
  inactivo:   { label: 'Inactivo',   dot: 'bg-neutral-600', text: 'text-neutral-500', border: 'border-neutral-700'  },
}
