import { STATUS_CONFIG }          from '../constants/statusConfig'
import type { StatusPillProps }   from '../types/status-pill.types'

const StatusPill = ({ status }: StatusPillProps) => {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <span
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             6,
        padding:         '4px 10px',
        borderRadius:    6,
        fontSize:        11,
        fontWeight:      600,
        letterSpacing:   '0.03em',
        color,
        backgroundColor: `${color}12`,
        border:          `1px solid ${color}28`,
      }}
    >
      {status === 'running' && (
        <span
          style={{
            width:           5,
            height:          5,
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
