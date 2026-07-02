import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCheck } from 'lucide-react'
import { useUserAuth } from '../../core/hooks/userAuth'
import { useNotifications } from '../../core/hooks/useNotifications'
import { useNotificationSettings, isTypeEnabled } from '../../core/hooks/useNotificationSettings'
import { NotifRow } from './NotifRow'
import type { NotifTab } from '../types/notif-tab.types'

const ProfileNav = () => {
  const { user }    = useUserAuth()
  const navigate    = useNavigate()
  const { notifications, markOneRead, markAllRead } = useNotifications()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'list' | 'settings'>('list')
  const [tab,  setTab]  = useState<NotifTab>('sinleer')
  const { settings, toggle } = useNotificationSettings()

  // Solo notificaciones de categorías activadas en los switches.
  const allowed = notifications.filter(n => isTypeEnabled(n.type, settings))
  const unread  = allowed.filter(n => n.status === 'unread').length
  const visible = tab === 'sinleer'
    ? allowed.filter(n => n.status === 'unread')
    : allowed

  const initials     = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?'
  const profileImage = user?.profile_image ?? null

  return (
    <>
      <header id="tour-step-profile"
        className="sticky top-0 z-40 flex items-center justify-end gap-2 px-6 h-14 flex-shrink-0 border-b border-neutral-900"
        style={{ backgroundColor: '#0A0A0B' }}>

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
      </header>

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

                <div className="flex items-center gap-1 mt-4 p-1 rounded-xl" style={{ backgroundColor: '#1A1A1C' }}>
                  {([
                    { id: 'sinleer' as NotifTab, label: 'Sin leer', count: unread },
                    { id: 'todas'   as NotifTab, label: 'Todas',    count: allowed.length },
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
                            onClick={() => toggle(item.key)}
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
                      <button onClick={() => toggle('sonido')}
                        className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                        style={{ backgroundColor: settings.sonido ? '#22C55E' : '#2A2A2D' }}>
                        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: settings.sonido ? '18px' : '2px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
