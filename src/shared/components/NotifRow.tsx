import { getNotifConfig }    from '../utils/get-notif-config'
import { formatTime }        from '../utils/format-time'
import type { NotifRowProps } from '../types/notif-row-props.types'

export const NotifRow = ({ n, onRead }: NotifRowProps) => {
  const c = getNotifConfig(n.type)
  return (
    <button
      onClick={() => onRead(n.id)}
      className="w-full text-left px-4 py-4 flex items-start gap-3 transition-colors hover:bg-neutral-900/60"
      style={{ borderBottom: '1px solid #1A1A1C' }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: c.bg }}>
        {c.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}>
            {c.label}
          </span>
          {n.status === 'unread' && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: n.status === 'unread' ? '#E4E4E7' : '#71717A' }}>
          {n.message}
        </p>
        <p className="text-[10px] mt-1.5" style={{ color: '#3F3F46' }}>{formatTime(n.created_at)}</p>
      </div>
    </button>
  )
}
