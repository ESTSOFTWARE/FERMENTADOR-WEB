import type { SocketConnectionStatus } from '../../../../core/network/sockeClient.types'
import type { SupportNotification }    from '../models/SupportNotification'

export interface SupportNotificationsRepository {
  connect: () => void
  disconnect: () => void
  onNotification: (cb: (n: SupportNotification) => void) => () => void
  onStatusChange: (cb: (s: SocketConnectionStatus) => void) => () => void
  getStatus: () => SocketConnectionStatus
}