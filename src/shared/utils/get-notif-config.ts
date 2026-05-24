import { NOTIF_CONFIG } from '../constants/notif-config.constants'
import type { NotifConfig } from '../types/notif-config.types'

export const getNotifConfig = (type: string): NotifConfig =>
  NOTIF_CONFIG[type] ?? NOTIF_CONFIG.general
