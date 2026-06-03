import { formatTime } from './format-time'

export const formatDate = (iso: string): string => {
  const diff = (Date.now() - new Date(iso).getTime()) / 86400000
  if (diff < 1) return formatTime(iso)
  if (diff < 2) return 'Ayer'
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
}
