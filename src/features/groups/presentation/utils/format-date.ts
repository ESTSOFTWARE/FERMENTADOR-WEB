export const formatDate = (dateStr: string | null, short = false): string => {
  if (!dateStr) return short ? '—' : 'Sin fecha'
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day:   short ? '2-digit' : 'numeric',
    month: 'short',
    year:  'numeric',
  })
}
