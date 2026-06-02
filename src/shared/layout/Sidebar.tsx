import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useExperimentStore } from '../../core/store/useExperimentStore'
import { nav } from '../../core/navigation/navItems'
import { useUserAuth } from '../../core/hooks/userAuth'
import { cn } from '../../lib/utils'
import { TOUR_IDS } from '../constants/tour-ids.constants'

const Sidebar = () => {
  const { experimentId, individualId } = useExperimentStore()
  const { user, logout }  = useUserAuth()
  const navigate           = useNavigate()
  const location           = useLocation()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Experimentar con IA': true })
  const [tourActive, setTourActive] = useState(() =>
    document.body.classList.contains('tour-active')
  )

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTourActive(document.body.classList.contains('tour-active'))
    )
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  const role       = user?.role?.toLowerCase() ?? 'estudiante'
  const visibleNav = nav.filter(item => item.allowedRoles.includes(role))

  const resolvePath = (path: string) => {
    if (path.includes('/simulation/:id')) return individualId ? `/simulation/${individualId}` : null
    if (path.includes(':id'))            return experimentId  ? path.replace(':id', experimentId) : null
    return path
  }

  const soloItems = visibleNav.filter(item => !item.group)
  const groups    = visibleNav
    .filter(item => item.group)
    .reduce<string[]>((acc, item) => {
      if (!acc.includes(item.group!)) acc.push(item.group!)
      return acc
    }, [])

  const renderItem = (item: typeof nav[0], indented = false) => {
    const resolved   = resolvePath(item.path)
    const isActive   = !!(resolved && location.pathname === resolved)
    const isDisabled = !resolved

    return (
      <button
        key={item.label}
        id={TOUR_IDS[item.path]}
        onClick={() => resolved && navigate(resolved)}
        disabled={isDisabled && !tourActive}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
          indented && 'ml-3 w-[calc(100%-12px)]',
          isActive   && 'bg-neutral-800 text-white',
          !isActive  && !isDisabled && 'text-neutral-500 hover:text-white hover:bg-neutral-900',
          isDisabled && !tourActive && 'text-neutral-700 cursor-not-allowed opacity-40',
          isDisabled && tourActive  && 'text-neutral-600 opacity-50 pointer-events-none',
        )}
      >
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d={item.icon} />
        </svg>
        <span className={cn('flex-1 text-xs font-medium', indented && 'text-[11px]')}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <aside id="tour-step-sidebar" className="fixed left-0 top-0 h-full w-60 flex flex-col bg-[#0A0A0B] border-r border-neutral-900">
      {/* Logo */}
      <div id="tour-step-logo" className="px-5 py-6 border-b border-neutral-900 flex items-center gap-3">
        <img src="/assets/logo.svg" alt="Nich-Ká" className="w-8 h-8 object-contain" />
        <div>
          <p className="text-white text-sm font-semibold leading-none">Nich-Ká</p>
          <p className="text-neutral-600 text-[10px] mt-0.5">Panel de control</p>
        </div>
      </div>

      {/* Nav */}
      <nav data-lenis-prevent className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {soloItems.map(item => renderItem(item))}

        {groups.map(group => {
          const groupItems  = visibleNav.filter(item => item.group === group)
          const firstItem   = groupItems[0]
          const isOpen      = tourActive || (openGroups[group] ?? false)
          const isAnyActive = groupItems.some(item => {
            const r = resolvePath(item.path)
            return r && location.pathname === r
          })

          return (
            <div key={group}>
              <button
                id={group === 'Experimentar con IA' ? 'tour-step-experimento' : group === 'Gestión de Usuarios' ? 'tour-step-usuarios-group' : undefined}
                onClick={() => setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left',
                  isAnyActive ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                )}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={firstItem.groupIcon ?? firstItem.icon} />
                </svg>
                <span className="flex-1 text-xs font-medium">{group}</span>
                <svg
                  className="w-3.5 h-3.5 text-neutral-600 transition-transform duration-200 flex-shrink-0"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div
                className="overflow-hidden transition-all duration-200 ml-3 border-l border-neutral-900"
                style={{ maxHeight: isOpen ? (tourActive ? '600px' : `${groupItems.length * 44}px`) : '0px' }}
              >
                <div className="py-1 flex flex-col gap-0.5">
                  {groupItems.map(item => renderItem(item, true))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer: logout */}
      <div className="px-3 py-4 border-t border-neutral-900 flex flex-col gap-1">
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-red-400 hover:bg-red-400/5 transition-colors text-left"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-xs font-medium">Cerrar sesión</span>
        </button>
        <p className="text-neutral-800 text-[10px] px-3">Panel de control v1.0</p>
      </div>
    </aside>
  )
}

export default Sidebar
