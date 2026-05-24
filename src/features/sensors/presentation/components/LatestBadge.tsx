import type { LatestBadgeProps as Props } from '../types/latest-badge.types'

const LatestBadge = ({ value, unit, color }: Props) => (
  <div>
    <span style={{ color, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>
      {value !== undefined ? value.toFixed(2) : '—'}
    </span>
    <span style={{ color: '#52525B', fontSize: 12, marginLeft: 4 }}>{unit}</span>
  </div>
)

export default LatestBadge
