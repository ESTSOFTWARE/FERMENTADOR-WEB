import { useState } from 'react'
import { cn } from '../../../../lib/utils'
import PaginationBar from '../../../../shared/components/PaginationBar'
import { PAGE_SIZE } from '../constants/pagination.constants'
import { NOTIF_TIPO_STYLE } from '../constants/notif-tipo-style.constants'
import { NOTIF_TIPO_ICON } from '../constants/notif-tipo-icon.constants'
import { useSupportNotificationsViewModel } from '../viewmodels/useSupportNotificationsViewModel'
import { timeAgo } from '../utils/time-ago'
import type { NotifType } from '../types/notif-type.types'
import type { Notificacion } from '../types/notificacion.types'

const NotificacionesPanel = () => {
  const { notifications, markAsRead, markAllAsRead } = useSupportNotificationsViewModel()
  const [filter, setFilter] = useState<'todas' | 'no-leidas'>('todas')
  const [page, setPage] = useState(1)

  // Adaptador: SupportNotification (dominio) → Notificacion (shape que consume el JSX).
  // 'ticket' ya tiene estilo/ícono definidos en NOTIF_TIPO_STYLE / NOTIF_TIPO_ICON.
  const notifs: Notificacion[] = notifications.map(n => ({
    id:          n.id,
    tipo:        'ticket',
    titulo:      n.title,
    descripcion: n.description,
    leida:       n.read,
    creadoEn:    n.createdAt,
  }))

  const marcarLeida = markAsRead
  const marcarTodas = markAllAsRead

  const noLeidas   = notifs.filter(n => !n.leida).length
  const filtered   = filter === 'no-leidas' ? notifs.filter(n => !n.leida) : notifs
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="h-full flex flex-col overflow-hidden">

      <div className="flex-shrink-0 px-8 pt-6 pb-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Notificaciones</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <button onClick={() => { setFilter('todas'); setPage(1) }}
              className={cn('text-xs transition-colors', filter === 'todas' ? 'text-white font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              Todas ({notifs.length})
            </button>
            <button onClick={() => { setFilter('no-leidas'); setPage(1) }}
              className={cn('flex items-center gap-1.5 text-xs transition-colors', filter === 'no-leidas' ? 'text-amber-400 font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sin leer ({noLeidas})
            </button>
          </div>
        </div>
        {noLeidas > 0 && (
          <button onClick={marcarTodas}
            className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors whitespace-nowrap">
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-neutral-600 text-sm">Sin notificaciones</p>
          </div>
        ) : paged.map(n => {
          const st = NOTIF_TIPO_STYLE[n.tipo as NotifType]
          return (
            <div key={n.id}
              className={cn(
                'px-8 py-4 border-b border-neutral-900 flex items-start gap-4 transition-colors group',
                n.leida ? 'hover:bg-neutral-900/30' : 'bg-neutral-900/50 hover:bg-neutral-900/70'
              )}>
              <div className={cn('mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', st.bg)}>
                <svg className={cn('w-4 h-4', st.dot.replace('bg-', 'text-'))} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={NOTIF_TIPO_ICON[n.tipo as NotifType]} />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {!n.leida && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', st.dot)} />}
                  <p className={cn('text-sm font-medium truncate', n.leida ? 'text-neutral-300' : 'text-white')}>
                    {n.titulo}
                  </p>
                  <span className="ml-auto text-[11px] text-neutral-600 whitespace-nowrap flex-shrink-0">
                    {timeAgo(n.creadoEn)}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{n.descripcion}</p>
                <span className={cn('inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full', st.bg, st.dot.replace('bg-', 'text-'))}>
                  {st.label}
                </span>
              </div>

              {!n.leida && (
                <button onClick={() => marcarLeida(n.id)}
                  className="flex-shrink-0 text-[11px] px-2.5 py-1 rounded-lg border border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap mt-0.5">
                  Marcar leída
                </button>
              )}
            </div>
          )
        })}
      </div>

      <PaginationBar
        page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE}
        onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
      />
    </div>
  )
}

export default NotificacionesPanel