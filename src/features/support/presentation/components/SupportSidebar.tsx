import { useNavigate, useLocation } from 'react-router-dom'
import { cn }                 from '../../../../lib/utils'
import { useSupportStore }    from '../../../../core/store/useSupportStore'
import { useUserAuth }        from '../../../../core/hooks/userAuth'
import { SIDEBAR_ITEMS }      from '../constants/sidebar-items.constants'
import { ROLE_LABELS }        from '../constants/role-labels.constants'

const SupportSidebar = () => {
  const pending      = useSupportStore(s => s.tickets.filter(t => t.status === 'pending').length)
  const { user, logout } = useUserAuth()
  const navigate         = useNavigate()
  const { pathname }     = useLocation()
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
        {SIDEBAR_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(`/support/${item.path}`)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
              pathname === `/support/${item.path}`
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

        <button
          onClick={() => navigate('/support/perfil')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left',
            pathname === '/support/perfil'
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
              {ROLE_LABELS[user?.role ?? ''] ?? user?.role ?? ''}
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
