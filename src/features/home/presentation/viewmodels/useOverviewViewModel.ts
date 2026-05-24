import { useUserAuth }                  from '../../../../core/hooks/userAuth'
import { useAnnouncementsViewModel }    from '../../../announcements/presentation/viewmodels/useAnnouncementsViewModel'
import { useSensorsViewModel }          from '../../../sensors/presentation/viewmodels/useSensorsViewModel'
import { QUICK_ACTIONS }                from '../constants/quick-actions.constants'
import { STATS }                        from '../constants/stats.constants'

export const useOverviewViewModel = () => {
  const { user }  = useUserAuth()
  const role      = user?.role?.toLowerCase() ?? 'estudiante'

  const { announcements }           = useAnnouncementsViewModel()
  const { latestValues, wsStatus }  = useSensorsViewModel({
    autoCircuitId: user?.circuit_id ?? undefined,
  })

  const recentAnnouncements = announcements.slice(0, 4)
  const visibleStats        = STATS.filter(s => s.allowedRoles.includes(role))
  const visibleActions      = QUICK_ACTIONS.filter(a => a.allowedRoles.includes(role))

  const tempValue = latestValues['temperature']
  const isLive    = wsStatus === 'connected'

  const date = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return { user, isLive, tempValue, date, visibleStats, visibleActions, recentAnnouncements }
}
