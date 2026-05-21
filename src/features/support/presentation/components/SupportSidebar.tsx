import { useNavigate } from 'react-router-dom'
import { cn } from '../../../../lib/utils'
import { useSupportStore } from '../../../../core/store/useSupportStore'
import { useUserAuth } from '../../../../core/hooks/userAuth'
import type { SupportSection } from '../view/SupportView'

const roleLabel: Record<string, string> = {
  admin: 'Administrador', soporte: 'Soporte', profesor: 'Profesor', estudiante: 'Estudiante',
}

interface Props {
  active: SupportSection
  onChange: (s: SupportSection) => void
}

const items: { id: SupportSection; label: string; icon: string }[] = [
  {
    id: 'tickets',
    label: 'Chats',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    id: 'clients',
    label: 'Usuarios',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 'fermentadores',
    label: 'Fermentadores',
    icon: 'M9 3h6M9 3v6l-4 10h14l-4-10V3M11 13h.01M13 11h.01',
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  },
  {
    id: 'anuncios',
    label: 'Comunicados',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.952 9.168-5v10.5c-1.543-3.048-5.068-5-9.168-5H7a3.988 3.988 0 01-1.564-.317z',
  },
]

const SupportSidebar = ({ active, onChange }: Props) => {
  const pending      = useSupportStore(s => s.tickets.filter(t => t.status === 'pending').length)
  const { user, logout } = useUserAuth()
  const navigate         = useNavigate()
  const profileImage     = user?.profile_image ?? null
  const initials         = user ? `${user.name[0]}${user.last_name?.[0] ?? ''}`.toUpperCase() : '?'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0A0A0B] border-r border-neutral-900 flex flex-col">
      <div className="px-5 py-6 border-b border-neutral-900 flex items-center gap-3">
        <img src="/assets/logo.svg" alt="Nich-Ká" className="w-8 h-8 object-contain" />
        <div>
          <p className="text-white text-sm font-semibold leading-none">Nich-Ká</p>
          <p className="text-neutral-600 text-[10px] mt-0.5">Soporte técnico</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
              active === item.id
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
            )}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            <span className="flex-1">{item.label}</span>
            {item.id === 'tickets' && pending > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center">
                {pending}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-900 flex flex-col gap-2">

        {/* User profile card */}
        <button
          onClick={() => onChange('perfil')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left',
            active === 'perfil'
              ? 'bg-neutral-800 border-neutral-700'
              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-neutral-700'
          )}
        >
          {profileImage ? (
            <img src={profileImage} alt="avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              style={{ border: '1px solid #22C55E30' }} />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: '#16A34A33', color: '#22C55E' }}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium leading-none truncate">
              {user ? `${user.name} ${user.last_name ?? ''}`.trim() : 'Usuario'}
            </p>
            <p className="text-neutral-500 text-[10px] mt-1 leading-none">
              {roleLabel[user?.role ?? ''] ?? user?.role ?? ''}
            </p>
          </div>
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-red-400 hover:bg-red-400/5 transition-colors text-left"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Cerrar sesión</span>
        </button>
        <p className="text-neutral-800 text-[10px] px-3">Panel de soporte v1.0</p>
      </div>
    </aside>
  )
}

export default SupportSidebar
