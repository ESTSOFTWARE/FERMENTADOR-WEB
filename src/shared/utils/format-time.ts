export const formatTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  if (min < 1)  return 'Ahora'
  if (min < 60) return `Hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24)   return `Hace ${h} h`
  const d = Math.floor(h / 24)
  if (d === 1)  return 'Ayer'
  return `Hace ${d} días`
}
