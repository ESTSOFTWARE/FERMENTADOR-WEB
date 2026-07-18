import { useEffect, useRef, useState, useCallback } from 'react'
import { useUserAuth } from '../../../../core/hooks/userAuth'
import { SupportNotificationsSocketDatasource } from '../../data/datasources/SupportNotificationsSocketDatasource'
import { SupportNotificationsRepositoryImpl }   from '../../data/repositories/SupportNotificationsRepositoryImpl'
import { ConnectSupportNotificationsUseCase }    from '../../domain/usecases/connect-support-notifications.usecase'
import { ListenSupportNotificationsUseCase }     from '../../domain/usecases/listen-support-notifications.usecase'
import { DisconnectSupportNotificationsUseCase } from '../../domain/usecases/disconnect-support-notifications.usecase'
import type { SupportNotification }              from '../../domain/models/SupportNotification'
import type { SocketConnectionStatus } from '../../../../core/network/sockeClient.types'

/**
 * Orquesta la conexión al canal de notificaciones de soporte.
 * No abre sockets directamente — delega todo a los UseCases.
 */
export const useSupportNotificationsViewModel = () => {
  const { user } = useUserAuth()
  const [notifications, setNotifications] = useState<SupportNotification[]>([])
  const [status, setStatus] = useState<SocketConnectionStatus>('idle')

  // Instancias estables durante todo el ciclo de vida del hook.
  const usecasesRef = useRef<{
    connect: ConnectSupportNotificationsUseCase
    listen: ListenSupportNotificationsUseCase
    disconnect: DisconnectSupportNotificationsUseCase
  } | null>(null)

  useEffect(() => {
    if (!user?.role || (user.role !== 'admin' && user.role !== 'soporte')) return

    const datasource = new SupportNotificationsSocketDatasource()
    const repo       = new SupportNotificationsRepositoryImpl(datasource, user.role)

    const connectUC    = new ConnectSupportNotificationsUseCase(repo)
    const listenUC      = new ListenSupportNotificationsUseCase(repo)
    const disconnectUC  = new DisconnectSupportNotificationsUseCase(repo)
    usecasesRef.current = { connect: connectUC, listen: listenUC, disconnect: disconnectUC }

    const offStatus = listenUC.onStatusChange(setStatus)
    const offEvent  = listenUC.onNotification((n) => {
      setNotifications(prev => prev.some(x => x.id === n.id) ? prev : [n, ...prev])
    })

    connectUC.execute()

    return () => {
      offStatus()
      offEvent()
      disconnectUC.execute()
      usecasesRef.current = null
    }
  }, [user?.role])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  return { notifications, status, markAsRead, markAllAsRead }
}