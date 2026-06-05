import { useCallback, useEffect, useRef, useState } from 'react'
import { supportChatApi } from '../../data/api/supportChatApi'
import type { SupportConversation, SupportMessage } from '../../domain/models/SupportChat'

const WS_BASE = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws').replace(/\/api$/, '')

/**
 * Viewmodel del lado ADMIN: su única conversación con soporte.
 * Carga (o crea) la conversación al montar, sus mensajes, recibe respuestas
 * de soporte en tiempo real e indica cuándo soporte está "escribiendo".
 */
export const useSupportAdminViewModel = () => {
  const [conversation, setConversation]   = useState<SupportConversation | null>(null)
  const [messages, setMessages]           = useState<SupportMessage[]>([])
  const [loading, setLoading]             = useState(true)
  const [sending, setSending]             = useState(false)
  const [supportTyping, setSupportTyping] = useState(false)

  const convIdRef    = useRef<number | null>(null)
  const wsRef        = useRef<WebSocket | null>(null)
  const typingInRef  = useRef<ReturnType<typeof setTimeout> | null>(null)   // ocultar "escribiendo" entrante
  const typingOutRef = useRef<ReturnType<typeof setTimeout> | null>(null)   // auto typing:stop saliente

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const conv = await supportChatApi.myConversation()
        if (!active) return
        setConversation(conv)
        convIdRef.current = conv.id
        const msgs = await supportChatApi.getMessages(conv.id)
        if (!active) return
        setMessages(msgs)
        await supportChatApi.markRead(conv.id)
      } catch { /* ignore */ }
      finally { if (active) setLoading(false) }
    })()

    const ws = new WebSocket(`${WS_BASE}/ws/support-chat`)
    wsRef.current = ws
    ws.onmessage = (event) => {
      let ev: { type: string; message?: SupportMessage; conversationId?: number; role?: string; typing?: boolean }
      try { ev = JSON.parse(event.data) } catch { return }

      if (ev.type === 'message:new' && ev.message && ev.message.conversationId === convIdRef.current) {
        const m = ev.message
        setMessages(prev => prev.some(x => x.id === m.id) ? prev : [...prev, m])
        setSupportTyping(false)
        if (m.senderRole === 'soporte') supportChatApi.markRead(m.conversationId).catch(() => {})
      }

      // Indicador "escribiendo" de soporte
      if (ev.type === 'typing' && ev.conversationId === convIdRef.current && ev.role === 'soporte') {
        if (ev.typing) {
          setSupportTyping(true)
          if (typingInRef.current) clearTimeout(typingInRef.current)
          typingInRef.current = setTimeout(() => setSupportTyping(false), 2500)
        } else {
          setSupportTyping(false)
        }
      }
    }

    return () => {
      active = false
      wsRef.current = null
      if (typingInRef.current) clearTimeout(typingInRef.current)
      if (typingOutRef.current) clearTimeout(typingOutRef.current)
      ws.close()
    }
  }, [])

  // ── Avisar que el admin está escribiendo (con auto-stop a los 2.5s) ──────────
  const notifyTyping = useCallback(() => {
    const ws = wsRef.current
    const id = convIdRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN || !id) return
    ws.send(JSON.stringify({ type: 'typing:start', conversationId: id }))
    if (typingOutRef.current) clearTimeout(typingOutRef.current)
    typingOutRef.current = setTimeout(() => {
      ws.send(JSON.stringify({ type: 'typing:stop', conversationId: id }))
    }, 2500)
  }, [])

  const send = useCallback(async (text: string) => {
    const conv = conversation
    if (!conv || !text.trim()) return
    setSending(true)
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'typing:stop', conversationId: conv.id }))
      }
      const msg = await supportChatApi.sendMessage(conv.id, text.trim())
      setMessages(prev => prev.some(x => x.id === msg.id) ? prev : [...prev, msg])
    } catch { /* ignore */ }
    finally { setSending(false) }
  }, [conversation])

  const sendAttachment = useCallback(async (file: File) => {
    const conv = conversation
    if (!conv) return
    setSending(true)
    try {
      const att = await supportChatApi.upload(file)
      const msg = await supportChatApi.sendMessage(conv.id, null, [att])
      setMessages(prev => prev.some(x => x.id === msg.id) ? prev : [...prev, msg])
    } catch { /* ignore */ }
    finally { setSending(false) }
  }, [conversation])

  return { conversation, messages, loading, sending, supportTyping, send, sendAttachment, notifyTyping }
}
