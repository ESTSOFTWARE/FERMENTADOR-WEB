import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCheck } from 'lucide-react'
import { useUserAuth } from '../../core/hooks/userAuth'

type NotifTab = 'sinleer' | 'comentarios' | 'lanzamientos'

interface Notification {
  id:      number
  title:   string
  body:    string
  time:    string
  read:    boolean
  type:    'success' | 'info'
  tab:     NotifTab
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Nueva sesión iniciada',    body: 'Se inició una fermentación en el circuito #12.',          time: 'Hace 5 min',  read: false, type: 'success', tab: 'sinleer'      },
  { id: 2, title: 'Alerta de temperatura',    body: 'La temperatura superó el umbral en el circuito #7.',      time: 'Hace 18 min', read: false, type: 'info',    tab: 'comentarios'  },
  { id: 3, title: 'Nuevo usuario registrado', body: 'María López se registró y está pendiente de activación.', time: 'Hace 1 h',    read: false, type: 'success', tab: 'sinleer'      },
  { id: 4, title: 'Versión beta 2026',        body: 'Se publicó la primera versión de la plataforma Nich-Ká.', time: 'Hace 3 h',    read: true,  type: 'info',    tab: 'lanzamientos' },
  { id: 5, title: 'Reporte generado',         body: 'El reporte de la sesión #44 ya está disponible.',         time: 'Ayer',        read: true,  type: 'success', tab: 'sinleer'      },
]

const ProfileNav = () => {
  const { user } = useUserAuth()
  const navigate  = useNavigate()
  const [open, setOpen]                   = useState(false)
  const [view, setView]                   = useState<'list' | 'settings'>('list')
  const [tab, setTab]                     = useState<NotifTab>('sinleer')
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [settings, setSettings]           = useState({
    alertas:     true,
    reportes:    true,
    usuarios:    true,
    comunicados: true,
    sonido:      false,
  })

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const markRead = (id: number) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const visible = tab === 'sinleer'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.tab === tab)

  const initials = user?.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

  const profileImage = user?.profile_image ?? null

  return (
    <>
      <div className="fixed top-5 right-6 z-40 flex items-center gap-2">

        {/* Campana */}
        <button
          onClick={() => setOpen(v => !v)}
          className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-neutral-800"
          style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={open ? '#F4F4F5' : '#52525B'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Perfil */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
          style={{ backgroundColor: '#111113', border: '1px solid #1F1F22', cursor: 'pointer' }}
        >
          {profileImage ? (
            <img src={profileImage} alt="avatar" className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              style={{ border: '1px solid #22C55E30' }} />
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#16A34A33', color: '#22C55E' }}>
              {initials}
            </div>
          )}
          <div className="text-left">
            <p className="text-xs font-medium leading-none mb-0.5" style={{ color: '#F4F4F5' }}>
              {user?.name ?? 'Usuario'}
            </p>
            <p style={{ color: '#52525B', fontSize: '10px', lineHeight: 1 }}>
              {user?.email ?? ''}
            </p>
          </div>
        </button>
      </div>

      {/* Drawer de notificaciones */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-96 flex flex-col"
              style={{ backgroundColor: '#0f0f10', borderLeft: '1px solid #1F1F22' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            >
              {/* Header */}
              <div className="flex-shrink-0 px-4 pt-5 pb-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => setOpen(false)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                  </button>
                  <p className="flex-1 text-white text-base font-bold">Notificaciones</p>
                  <button onClick={markAllRead} title="Marcar todas como leídas"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                    <CheckCheck size={16} />
                  </button>
                  <button
                    onClick={() => setView(v => v === 'settings' ? 'list' : 'settings')}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: view === 'settings' ? '#F4F4F5' : '#71717A', backgroundColor: view === 'settings' ? '#2A2A2D' : 'transparent' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mt-4 p-1 rounded-xl" style={{ backgroundColor: '#1A1A1C' }}>
                  {([
                    { id: 'sinleer',      label: 'Sin leer'     },
                    { id: 'comentarios',  label: 'Comentarios'  },
                    { id: 'lanzamientos', label: 'Lanzamientos' },
                  ] as { id: NotifTab; label: string }[]).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                      style={{
                        backgroundColor: tab === t.id ? '#2A2A2D' : 'transparent',
                        color:           tab === t.id ? '#F4F4F5' : '#52525B',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuración */}
              {view === 'settings' && (
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
                  <div>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3">Tipos de notificación</p>
                    <div className="flex flex-col gap-1">
                      {([
                        { key: 'alertas',     label: 'Alertas de sensores',  desc: 'Temperatura, pH y otros umbrales' },
                        { key: 'reportes',    label: 'Reportes generados',   desc: 'Cuando un reporte esté listo'     },
                        { key: 'usuarios',    label: 'Nuevos usuarios',      desc: 'Registros pendientes de activar'  },
                        { key: 'comunicados', label: 'Comunicados',          desc: 'Avisos publicados en la plataforma' },
                      ] as { key: keyof typeof settings; label: string; desc: string }[]).map(item => (
                        <div key={item.key} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-neutral-900/60 transition-colors">
                          <div>
                            <p className="text-white text-xs font-medium">{item.label}</p>
                            <p className="text-neutral-600 text-[11px] mt-0.5">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                            className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                            style={{ backgroundColor: settings[item.key] ? '#22C55E' : '#2A2A2D' }}
                          >
                            <span
                              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                              style={{ left: settings[item.key] ? '18px' : '2px' }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-3">Preferencias</p>
                    <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-neutral-900/60 transition-colors">
                      <div>
                        <p className="text-white text-xs font-medium">Sonido</p>
                        <p className="text-neutral-600 text-[11px] mt-0.5">Reproducir sonido al recibir notificaciones</p>
                      </div>
                      <button
                        onClick={() => setSettings(s => ({ ...s, sonido: !s.sonido }))}
                        className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                        style={{ backgroundColor: settings.sonido ? '#22C55E' : '#2A2A2D' }}
                      >
                        <span
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: settings.sonido ? '18px' : '2px' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista */}
              {view === 'list' && <div className="flex-1 overflow-y-auto">
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-600 pb-16">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  visible.map(n => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className="w-full text-left px-4 py-4 flex items-start gap-3 transition-colors hover:bg-neutral-900/60"
                      style={{ borderBottom: '1px solid #1A1A1C' }}
                    >
                      {/* Ícono circular */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: n.type === 'success' ? '#16A34A22' : '#3B82F622' }}>
                        {n.type === 'success' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5"
                          style={{ backgroundColor: '#22C55E20', color: '#22C55E', border: '1px solid #22C55E30' }}>
                          NUEVO
                        </span>
                        <p className="text-xs font-bold leading-snug mb-1 text-white">{n.title}</p>
                        <p className="text-[11px] leading-relaxed" style={{ color: '#71717A' }}>{n.body}</p>
                        <p className="text-[10px] mt-1.5" style={{ color: '#3F3F46' }}>{n.time}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProfileNav
