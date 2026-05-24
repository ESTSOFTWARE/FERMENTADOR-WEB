import { STATUS_CONFIG }         from '../constants/status-config.constants'
import type { StatusPillProps }  from '../types/StatusPillProps'

const StatusPill = ({ status }: StatusPillProps) => {
  const { label, color } = STATUS_CONFIG[status] ?? { label: status, color: '#71717A' }
  return (
    <span
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             6,
        padding:         '4px 12px',
        borderRadius:    999,
        fontSize:        11,
        fontWeight:      500,
        color,
        backgroundColor: `${color}15`,
        border:          `1px solid ${color}30`,
      }}
    >
      {status === 'running' && (
        <span
          style={{
            width:           6,
            height:          6,
            borderRadius:    '50%',
            backgroundColor: color,
            display:         'inline-block',
            animation:       'pulse 1.5s infinite',
          }}
        />
      )}
      {label}
    </span>
  )
}

export default StatusPill
