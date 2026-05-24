import type { EfficiencyLabel } from '../types/efficiency-label.types'

export const getEfficiencyLabel = (pct: number): EfficiencyLabel => {
  if (pct === 0)  return { text: 'Ingresa los valores para calcular',      color: '#52525B' }
  if (pct >= 90)  return { text: 'Excelente — fermentación óptima',        color: '#22C55E' }
  if (pct >= 75)  return { text: 'Buena eficiencia',                       color: '#4ADE80' }
  if (pct >= 50)  return { text: 'Eficiencia aceptable — revisar proceso', color: '#F59E0B' }
  return           { text: 'Baja eficiencia — proceso deficiente',         color: '#F43F5E' }
}
