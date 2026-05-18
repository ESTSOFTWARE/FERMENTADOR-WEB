import { useState } from 'react'
import { cn } from '../../../../lib/utils'
import PaginationBar from '../../../../shared/components/PaginationBar'

const PAGE_SIZE = 10

type NotifType = 'ticket' | 'fermentador' | 'sistema' | 'usuario'

interface Notificacion {
  id: string
  tipo: NotifType
  titulo: string
  descripcion: string
  leida: boolean
  creadoEn: string
}

const MOCK: Notificacion[] = [
  { id: '1',  tipo: 'ticket',      titulo: 'Nuevo chat de soporte',           descripcion: 'Carlos Méndez abrió un nuevo chat sobre calibración de sensores.',         leida: false, creadoEn: '2024-01-20T09:05:00Z' },
  { id: '2',  tipo: 'fermentador', titulo: 'Fermentador sin conexión',         descripcion: 'FRM-00004 lleva más de 24 horas sin reportar datos.',                       leida: false, creadoEn: '2024-01-20T08:30:00Z' },
  { id: '3',  tipo: 'usuario',     titulo: 'Nuevo registro de usuario',        descripcion: 'Ana Torres se registró en la plataforma y está esperando activación.',      leida: false, creadoEn: '2024-01-20T07:45:00Z' },
  { id: '4',  tipo: 'ticket',      titulo: 'Chat sin respuesta (48 h)',        descripcion: 'El chat de Finca El Roble lleva 2 días sin respuesta del equipo.',           leida: true,  creadoEn: '2024-01-19T16:00:00Z' },
  { id: '5',  tipo: 'sistema',     titulo: 'Actualización disponible',         descripcion: 'Firmware v2.3.1 disponible para los módulos IoT del lote 2024-01.',          leida: true,  creadoEn: '2024-01-19T10:00:00Z' },
  { id: '6',  tipo: 'fermentador', titulo: 'Temperatura fuera de rango',       descripcion: 'FRM-00002 reportó temperatura de 38°C, por encima del límite configurado.',  leida: true,  creadoEn: '2024-01-18T22:15:00Z' },
  { id: '7',  tipo: 'usuario',     titulo: 'Código de activación usado',       descripcion: 'El código ACT-9C3B fue usado por Ana Torres para activar su cuenta.',       leida: true,  creadoEn: '2024-01-18T14:30:00Z' },
  { id: '8',  tipo: 'sistema',     titulo: 'Respaldo completado',              descripcion: 'El respaldo automático de la base de datos se completó correctamente.',      leida: true,  creadoEn: '2024-01-17T03:00:00Z' },
  { id: '9',  tipo: 'ticket',      titulo: 'Chat escalado a soporte',          descripcion: 'Sofía Ramírez solicitó escalación tras 3 respuestas sin solución.',          leida: false, creadoEn: '2024-01-20T10:10:00Z' },
  { id: '10', tipo: 'fermentador', titulo: 'pH fuera de rango',                descripcion: 'FRM-00007 reportó pH de 5.1, fuera del rango óptimo de fermentación.',       leida: false, creadoEn: '2024-01-20T06:00:00Z' },
  { id: '11', tipo: 'sistema',     titulo: 'Límite de usuarios alcanzado',     descripcion: 'La instancia actual alcanzó el límite de 50 usuarios activos.',              leida: true,  creadoEn: '2024-01-17T11:00:00Z' },
  { id: '12', tipo: 'usuario',     titulo: 'Cuenta suspendida',                descripcion: 'La cuenta de Roberto Jiménez fue suspendida por inactividad prolongada.',    leida: true,  creadoEn: '2024-01-16T09:30:00Z' },
  { id: '13', tipo: 'fermentador', titulo: 'Fermentador dado de alta',         descripcion: 'FRM-00015 fue registrado en el sistema por Melissa Corral.',                 leida: true,  creadoEn: '2024-01-16T08:00:00Z' },
  { id: '14', tipo: 'sistema',     titulo: 'Integración IoT desconectada',     descripcion: 'El broker MQTT perdió conexión con 3 dispositivos del lote 2024-Q1.',        leida: false, creadoEn: '2024-01-20T05:30:00Z' },
  { id: '15', tipo: 'ticket',      titulo: 'Chat cerrado por inactividad',     descripcion: 'El chat de Emilio Castillo fue cerrado automáticamente tras 7 días.',        leida: true,  creadoEn: '2024-01-15T12:00:00Z' },
]

const TIPO_STYLE: Record<NotifType, { dot: string; bg: string; label: string }> = {
  ticket:      { dot: 'bg-amber-400',   bg: 'bg-amber-400/10',    label: 'Chat'         },
  fermentador: { dot: 'bg-red-400',     bg: 'bg-red-400/10',      label: 'Fermentador'  },
  sistema:     { dot: 'bg-blue-400',    bg: 'bg-blue-400/10',     label: 'Sistema'      },
  usuario:     { dot: 'bg-green-400',   bg: 'bg-green-400/10',    label: 'Usuario'      },
}

const TIPO_ICON: Record<NotifType, string> = {
  ticket:      'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  fermentador: 'M9 3h6M9 3v6l-4 10h14l-4-10V3M11 13h.01M13 11h.01',
  sistema:     'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  usuario:     'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
}

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)    return 'ahora'
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hr`
  return `hace ${Math.floor(diff / 86400)} d`
}

const NotificacionesPanel = () => {
  const [notifs, setNotifs] = useState(MOCK)
  const [filter, setFilter] = useState<'todas' | 'no-leidas'>('todas')
  const [page, setPage]     = useState(1)

  const noLeidas   = notifs.filter(n => !n.leida).length
  const filtered   = filter === 'no-leidas' ? notifs.filter(n => !n.leida) : notifs
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const marcarLeida = (id: string) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n))

  const marcarTodas = () =>
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })))

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* ── Header ── */}
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

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p className="text-neutral-600 text-sm">Sin notificaciones</p>
          </div>
        ) : paged.map(n => {
          const st = TIPO_STYLE[n.tipo]
          return (
            <div key={n.id}
              className={cn(
                'px-8 py-4 border-b border-neutral-900 flex items-start gap-4 transition-colors group',
                n.leida ? 'hover:bg-neutral-900/30' : 'bg-neutral-900/50 hover:bg-neutral-900/70'
              )}>
              <div className={cn('mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', st.bg)}>
                <svg className={cn('w-4 h-4', st.dot.replace('bg-', 'text-'))} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={TIPO_ICON[n.tipo]} />
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
