import type { ChartTooltipProps as Props } from '../types/chart-tooltip.types'

const ChartTooltip = ({ active, payload, label, unit }: Props) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ backgroundColor: '#111113', border: '1px solid #1F1F22', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: 'Poppins, sans-serif' }}>
      <p style={{ color: '#52525B', margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ color: '#F4F4F5', margin: 0, fontWeight: 600 }}>
        {payload[0].value.toFixed(3)} {unit}
      </p>
    </div>
  )
}

export default ChartTooltip
