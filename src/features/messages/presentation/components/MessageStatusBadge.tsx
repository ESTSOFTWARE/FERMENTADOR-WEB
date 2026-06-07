import { cn } from '../../../../lib/utils'

interface MessageStatusBadgeProps {
  unreadCount: number
}

export const MessageStatusBadge = ({ unreadCount }: MessageStatusBadgeProps) => {
  const isUnread = unreadCount > 0

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border whitespace-nowrap',
      isUnread
        ? 'text-green-400 bg-green-400/10 border-green-400/30'
        : 'text-neutral-400 bg-neutral-800/40 border-neutral-700/40'
    )}>
      {isUnread ? (
        <>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {unreadCount} sin leer
        </>
      ) : (
        <>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Leído
        </>
      )}
    </span>
  )
}
