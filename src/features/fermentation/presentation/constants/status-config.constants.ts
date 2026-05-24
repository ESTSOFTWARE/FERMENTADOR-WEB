import type { FermentationStatus } from '../../domain/models/FermentationStatus'

export const STATUS_CONFIG: Record<FermentationStatus, { label: string; color: string }> = {
  running:     { label: 'En curso',     color: '#22C55E' },
  scheduled:   { label: 'Programada',   color: '#3B82F6' },
  completed:   { label: 'Completada',   color: '#A78BFA' },
  interrupted: { label: 'Interrumpida', color: '#F59E0B' },
}
