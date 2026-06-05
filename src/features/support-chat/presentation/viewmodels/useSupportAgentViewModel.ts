import { useCallback, useEffect, useRef, useState } from 'react'
import { supportChatApi } from '../../data/api/supportChatApi'
import type { SupportConversation, SupportMessage } from '../../domain/models/SupportChat'

const WS_BASE = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws').replace(/\/api$/, '')

/**
 * Viewmodel del panel de soporte (agente). Lista la cola de conversaciones,
 * carga mensajes de la seleccionada y recibe mensajes nuevos en tiempo real
 * por el WebSocket /ws/support-chat.
 */
export const useSupportAgentViewModel = () => {
  const [conversations, setConversations] = useState<SupportConversation[]>([])
  const [loading, setLoading]             = useState(true)
  const [selected, setSelected]           = useState<SupportConversation | null>(null)
  const [messages, setMessages]           = useState<SupportMessage[]>([])
  const [loadingMessages, setLoadingMsgs] = useState(false)
  const [sending, setSending]             = useState(false)
  const [adminTyping, setAdminTyping]     = useState(false)

  const selectedRef  = useRef<number | null>(null)
  const wsRef        = useRef<WebSocket | null>(null)
  const typingInRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingOutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Carga inicial de la cola ──────────────────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const data = await supportChatApi.listConversations()
      setConversations(data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  // ── WebSocket en tiempo real ──────────────────────────────────────────────
  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/support-chat`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      let ev: { type: string; message?: SupportMessage; conversation?: SupportConversation; conversationId?: number; role?: string; typing?: boolean }
      try { ev = JSON.parse(event.data) } catch { return }

      // Indicador "escribiendo" del admin en la conversación abierta
      if (ev.type === 'typing' && ev.conversationId === selectedRef.current && ev.role === 'admin') {
        if (ev.typing) {
          setAdminTyping(true)
          if (typingInRef.current) clearTimeout(typingInRef.current)
          typingInRef.current = setTimeout(() => setAdminTyping(false), 2500)
        } else {
          setAdminTyping(false)
        }
        return
      }

      if (ev.type === 'message:new' && ev.message) {
        const m = ev.message
        // Si es de la conversación abierta, agregar al hilo
        if (selectedRef.current === m.conversationId) {
          setMessages(prev => prev.some(x => x.id === m.id) ? prev : [...prev, m])
          setAdminTyping(false)
        }
        // Actualizar lastMessage/unread en la lista (subir la conversación)
        setConversations(prev => {
          const idx = prev.findIndex(c => c.id === m.conversationId)
          if (idx === -1) { refresh(); return prev }
          const c = prev[idx]
          const isOpen = selectedRef.current === m.conversationId
          const updated: SupportConversation = {
            ...c,
            lastMessage: m,
            unreadCount: isOpen || m.senderRole === 'soporte' ? 0 : c.unreadCount + 1,
          }
          return [updated, ...prev.filter(x => x.id !== c.id)]
        })
      }

      if (ev.type === 'conversation:new' && ev.conversation) {
        const conv = ev.conversation
        setConversations(prev => prev.some(c => c.id === conv.id) ? prev : [conv, ...prev])
      }
    }

    return () => {
      wsRef.current = null
      if (typingInRef.current) clearTimeout(typingInRef.current)
      if (typingOutRef.current) clearTimeout(typingOutRef.current)
      ws.close()
    }
  }, [refresh])

  // ── Avisar que el agente está escribiendo (auto-stop a los 2.5s) ────────────
  const notifyTyping = useCallback(() => {
    const ws = wsRef.current
    const id = selectedRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN || !id) return
    ws.send(JSON.stringify({ type: 'typing:start', conversationId: id }))
    if (typingOutRef.current) clearTimeout(typingOutRef.current)
    typingOutRef.current = setTimeout(() => {
      ws.send(JSON.stringify({ type: 'typing:stop', conversationId: id }))
    }, 2500)
  }, [])

  // ── Seleccionar conversación → cargar mensajes + marcar leído ─────────────
  const selectConversation = useCallback(async (conv: SupportConversation) => {
    setSelected(conv)
    selectedRef.current = conv.id
    setAdminTyping(false)
    setLoadingMsgs(true)
    try {
      const msgs = await supportChatApi.getMessages(conv.id)
      setMessages(msgs)
      await supportChatApi.markRead(conv.id)
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    } catch { /* ignore */ }
    finally { setLoadingMsgs(false) }
  }, [])

  const closeSelected = useCallback(() => {
    setSelected(null)
    selectedRef.current = null
    setMessages([])
    setAdminTyping(false)
  }, [])

  // ── Responder ─────────────────────────────────────────────────────────────
  const sendReply = useCallback(async (text: string) => {
    if (!selected || !text.trim()) return
    setSending(true)
    try {
      const msg = await supportChatApi.sendMessage(selected.id, text.trim())
      setMessages(prev => prev.some(x => x.id === msg.id) ? prev : [...prev, msg])
      setConversations(prev => {
        const c = prev.find(x => x.id === selected.id)
        if (!c) return prev
        return [{ ...c, lastMessage: msg }, ...prev.filter(x => x.id !== c.id)]
      })
    } catch { /* ignore */ }
    finally { setSending(false) }
  }, [selected])

  const sendAttachment = useCallback(async (file: File) => {
    if (!selected) return
    setSending(true)
    try {
      const att = await supportChatApi.upload(file)
      const msg = await supportChatApi.sendMessage(selected.id, null, [att])
      setMessages(prev => prev.some(x => x.id === msg.id) ? prev : [...prev, msg])
    } catch { /* ignore */ }
    finally { setSending(false) }
  }, [selected])

  return {
    conversations, loading,
    selected, selectConversation, closeSelected,
    messages, loadingMessages, adminTyping,
    sending, sendReply, sendAttachment, notifyTyping,
    refresh,
  }
}
