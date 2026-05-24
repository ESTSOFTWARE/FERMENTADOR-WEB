import type { AppNotification } from '../../core/hooks/useNotifications'

export interface NotifRowProps {
  n:      AppNotification
  onRead: (id: number) => void
}
