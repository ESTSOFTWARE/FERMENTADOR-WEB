export const formatDatetime = (iso: string): string =>
  new Date(iso)
    .toLocaleString('es-MX', {
      year:   'numeric',
      month:  '2-digit',
      day:    '2-digit',
      hour:   '2-digit',
      minute: '2-digit',
    })
    .replace(',', '')
