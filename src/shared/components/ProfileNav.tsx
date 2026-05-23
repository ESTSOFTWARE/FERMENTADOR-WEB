import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCheck } from 'lucide-react'
import { useUserAuth } from '../../core/hooks/userAuth'
import { useNotifications, type AppNotification } from '../../core/hooks/useNotifications'

type NotifTab = 'sinleer' | 'todas'

// ── Configuración visual por tipo ─────────────────────────────────────────────
interface NotifConfig { label: string; color: string; bg: string; icon: React.ReactNode }

const NOTIF_CONFIG: Record<string, NotifConfig> = {
  fermentation_complete: {
    label: 'Fermentación', color: '#22C55E', bg: '#16A34A22',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>,
  },
  fermentation_interrupted: {
    label: 'Fermentación', color: '#F97316', bg: '#F9731622',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  high_temperature: {
    label: 'Temperatura', color: '#EF4444', bg: '#EF444422',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>,
  },
  sensor_failure: {
    label: 'Sensor', color: '#EF4444', bg: '#EF444422',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
  new_announcement: {
    label: 'Comunicado', color: '#3B82F6', bg: '#3B82F622',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
  member_added: {
    label: 'Grupo', color: '#22C55E', bg: '#16A34A22',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  },
  member_removed: {
    label: 'Grupo', color: '#F97316', bg: '#F9731622',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  },
  user_registered: {
    label: 'Usuario', color: '#A78BFA', bg: '#A78BFA22',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>,
  },
  experiment_complete: {
    label: 'Experimento', color: '#A78BFA', bg: '#A78BFA22',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  general: {
    label: 'General', color: '#71717A', bg: '#71717A22',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
}

const cfg = (type: string): NotifConfig => NOTIF_CONFIG[type] ?? NOTIF_CONFIG.general

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  if (min < 1)   return 'Ahora'
  if (min < 60)  return `Hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24)    return `Hace ${h} h`
  const d = Math.floor(h / 24)
  if (d === 1)   return 'Ayer'
  return `Hace ${d} días`
}

const NotifRow = ({ n, onRead }: { n: AppNotification; onRead: (id: number) => void }) => {
  const c = cfg(n.type)
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

const ProfileNav = () => {
  const { user }    = useUserAuth()
  const navigate    = useNavigate()
  const { notifications, markOneRead, markAllRead } = useNotifications()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'list' | 'settings'>('list')
  const [tab,  setTab]  = useState<NotifTab>('sinleer')
  const [settings, setSettings] = useState({
    alertas: true, reportes: true, usuarios: true, comunicados: true, sonido: false,
  })

  const unread  = notifications.filter(n => n.status === 'unread').length
  const visible = tab === 'sinleer'
    ? notifications.filter(n => n.status === 'unread')
    : notifications

  const initials     = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?'
  const profileImage = user?.profile_image ?? null

  return (
    <>
      <div id="tour-step-profile" className="fixed top-5 right-6 z-40 flex items-center gap-2">

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
            <motion.div
              className="fixed inset-0 z-50 bg-black/30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

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
                  {unread > 0 && (
                    <button onClick={markAllRead} title="Marcar todas como leídas"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
                      <CheckCheck size={16} />
                    </button>
                  )}
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
                    { id: 'sinleer' as NotifTab, label: 'Sin leer', count: unread },
                    { id: 'todas'   as NotifTab, label: 'Todas',    count: notifications.length },
                  ]).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                      style={{ backgroundColor: tab === t.id ? '#2A2A2D' : 'transparent', color: tab === t.id ? '#F4F4F5' : '#52525B' }}>
                      {t.label}
                      {t.count > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: tab === t.id ? '#3F3F46' : '#2A2A2D', color: '#A1A1AA' }}>
                          {t.count}
                        </span>
                      )}
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
                        { key: 'alertas',     label: 'Alertas de sensores',  desc: 'Temperatura, pH y otros umbrales'   },
                        { key: 'reportes',    label: 'Fermentaciones',       desc: 'Inicio, fin e interrupciones'       },
                        { key: 'usuarios',    label: 'Usuarios y grupos',    desc: 'Registros y cambios en grupos'      },
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
                            <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                              style={{ left: settings[item.key] ? '18px' : '2px' }} />
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
                      <button onClick={() => setSettings(s => ({ ...s, sonido: !s.sonido }))}
                        className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                        style={{ backgroundColor: settings.sonido ? '#22C55E' : '#2A2A2D' }}>
                        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: settings.sonido ? '18px' : '2px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista */}
              {view === 'list' && (
                <div className="flex-1 overflow-y-auto" data-lenis-prevent>
                  {visible.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-neutral-600 pb-16">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                      <p className="text-sm">{tab === 'sinleer' ? 'Sin notificaciones pendientes' : 'Sin notificaciones'}</p>
                    </div>
                  ) : (
                    visible.map(n => <NotifRow key={n.id} n={n} onRead={markOneRead} />)
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProfileNav
