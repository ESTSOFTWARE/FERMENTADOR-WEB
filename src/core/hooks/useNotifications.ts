import { useState, useEffect, useRef, useCallback } from 'react'
import { useUserAuth } from './userAuth'
import { apiClient }   from '../network/client'
import { loadNotifSettings, isTypeEnabled } from './useNotificationSettings'

const WS = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws').replace(/\/api$/, '')

export interface AppNotification {
  id:         number
  user_id:    number
  message:    string
  type:       string
  status:     'unread' | 'read'
  session_id: number | null
  created_at: string
}

export const useNotifications = () => {
  const { user }  = useUserAuth()
  const wsRef     = useRef<WebSocket | null>(null)
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  useEffect(() => {
    if (!user?.id) return

    apiClient.get<AppNotification[]>('/notifications/')
      .then(data => setNotifications(data))
      .catch(() => {})

    const ws = new WebSocket(`${WS}/ws/notifications/${user.id}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (!msg.notification_id) return
        setNotifications(prev => [{
          id:         msg.notification_id,
          user_id:    user.id,
          message:    msg.message,
          type:       msg.type,
          status:     'unread',
          session_id: msg.session_id ?? null,
          created_at: msg.occurred_at,
        }, ...prev])

        // Sonido: solo si está activado y la categoría de la notificación está habilitada.
        const s = loadNotifSettings()
        if (s.sonido && isTypeEnabled(msg.type, s)) {
          new Audio('/assets/sounds/sound_notification.mp3').play().catch(() => { /* autoplay bloqueado */ })
        }
      } catch { /* ignore malformed */ }
    }

    return () => { ws.close() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const markOneRead = useCallback(async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n))
    await apiClient.patch(`/notifications/${id}/read`).catch(() => {})
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
    await apiClient.patch('/notifications/read-all').catch(() => {})
  }, [])

  return { notifications, markOneRead, markAllRead }
}
