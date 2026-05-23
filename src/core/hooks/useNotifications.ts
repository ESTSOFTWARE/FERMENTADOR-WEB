import { useState, useEffect, useRef, useCallback } from 'react'
import { useUserAuth } from './userAuth'

const API = import.meta.env.VITE_API_URL
const WS  = import.meta.env.VITE_WS_URL ?? API.replace(/^http/, 'ws').replace(/\/api$/, '')

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

  const token = localStorage.getItem('access_token')

  useEffect(() => {
    if (!user?.id || !token) return

    fetch(`${API}/notifications/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then((data: AppNotification[]) => setNotifications(data))
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
      } catch { /* ignore malformed */ }
    }

    return () => { ws.close() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const markOneRead = useCallback(async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n))
    await fetch(`${API}/notifications/${id}/read`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }, [token])

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))
    await fetch(`${API}/notifications/read-all`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }, [token])

  return { notifications, markOneRead, markAllRead }
}
