export const getEfficiencyColor = (pct: number): string => {
  if (pct >= 80) return '#22C55E'
  if (pct >= 50) return '#F59E0B'
  return '#F43F5E'
}
