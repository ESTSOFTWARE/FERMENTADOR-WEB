import { useState, useEffect, useRef, useCallback } from 'react'
import { sileo }                            from 'sileo'
import { ChatRepositoryImpl }               from '../../data/repositories/ChatRepositoryImpl'
import { mapMessage, mapConversation, mapReactions, chatApi } from '../../data/api/chatApi'
import { loadNotifSettings }                  from '../../../../core/hooks/useNotificationSettings'
import { GetConversationsUseCase }          from '../../domain/usecases/get-conversations.usecase'
import { GetContactsUseCase }               from '../../domain/usecases/get-contacts.usecase'
import { GetMessagesUseCase }               from '../../domain/usecases/get-messages.usecase'
import { CreateConversationUseCase }        from '../../domain/usecases/create-conversation.usecase'
import { UpdateConversationUseCase }        from '../../domain/usecases/update-conversation.usecase'
import { LeaveConversationUseCase }         from '../../domain/usecases/leave-conversation.usecase'
import { MarkReadUseCase }                  from '../../domain/usecases/mark-read.usecase'
import { SendMessageUseCase }               from '../../domain/usecases/send-message.usecase'
import { EditMessageUseCase }               from '../../domain/usecases/edit-message.usecase'
import { DeleteMessageUseCase }             from '../../domain/usecases/delete-message.usecase'
import { PinMessageUseCase }                from '../../domain/usecases/pin-message.usecase'
import { SetPriorityUseCase }               from '../../domain/usecases/set-priority.usecase'
import { ToggleReactionUseCase }            from '../../domain/usecases/toggle-reaction.usecase'
import { UploadFileUseCase }                from '../../domain/usecases/upload-file.usecase'
import type { Conversation }                from '../../domain/models/Conversation'
import type { ChatMessage }                 from '../../domain/models/ChatMessage'
import type { ChatMember }                  from '../../domain/models/ChatMember'
import type { MessagePriority }             from '../../domain/models/Chat.types'
import type { MessageReplyTo }              from '../../domain/models/MessageReplyTo'
import { MY_ID }                            from '../constants/current-user.constants'
import { TOAST_STYLE }                      from '../constants/toast-style.constants'

export { MY_ID }

const WS_BASE = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_URL?.replace(/^http/, 'ws').replace(/\/api$/, '')

const repo               = new ChatRepositoryImpl()
const getConversations   = new GetConversationsUseCase(repo)
const getContacts        = new GetContactsUseCase(repo)
const getMessages        = new GetMessagesUseCase(repo)
const createConversation = new CreateConversationUseCase(repo)
const updateConversation = new UpdateConversationUseCase(repo)
const leaveConversation  = new LeaveConversationUseCase(repo)
const markRead           = new MarkReadUseCase(repo)
const sendMessage        = new SendMessageUseCase(repo)
const editMessage        = new EditMessageUseCase(repo)
const deleteMessage      = new DeleteMessageUseCase(repo)
const pinMessage         = new PinMessageUseCase(repo)
const setPriorityUC      = new SetPriorityUseCase(repo)
const toggleReaction     = new ToggleReactionUseCase(repo)
const uploadFile         = new UploadFileUseCase(repo)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WsEvent = any

export const useMessagesViewModel = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [contacts,      setContacts]      = useState<ChatMember[]>([])
  const [activeId,      setActiveId]      = useState<string | null>(null)
  const [messages,      setMessages]      = useState<Record<string, ChatMessage[]>>({})
  const [newConvModal,  setNewConvModal]  = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const [replyTo,       setReplyTo]       = useState<MessageReplyTo | null>(null)
  const [typingByConv,  setTypingByConv]  = useState<Record<string, string[]>>({})
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())

  const wsRef       = useRef<WebSocket | null>(null)
  const activeIdRef = useRef<string | null>(null)
  useEffect(() => { activeIdRef.current = activeId }, [activeId])

  /* ── helper: actualizar un mensaje por id en cualquier conversación ── */
  const patchMessage = useCallback((msgId: string, patch: Partial<ChatMessage>) => {
    setMessages(prev => {
      const next: Record<string, ChatMessage[]> = {}
      for (const [cid, list] of Object.entries(prev)) {
        next[cid] = list.map(m => m.id === msgId ? { ...m, ...patch } : m)
      }
      return next
    })
  }, [])

  /* ── carga inicial + WebSocket ── */
  useEffect(() => {
    getConversations.execute().then(setConversations).catch(() => {})
    getContacts.execute().then(setContacts).catch(() => {})

    const ws = new WebSocket(`${WS_BASE}/ws/chat`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      let data: WsEvent
      try { data = JSON.parse(event.data) } catch { return }

      switch (data.type) {
        case 'message:new': {
          const msg = mapMessage(data.message)
          setMessages(prev => {
            const list = prev[msg.conversationId] ?? []
            if (list.some(m => m.id === msg.id)) return prev
            return { ...prev, [msg.conversationId]: [...list, msg] }
          })
          setConversations(prev => prev.map(c => c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg,
                unreadCount: msg.conversationId === activeIdRef.current || msg.senderId === MY_ID
                  ? c.unreadCount : c.unreadCount + 1,
              }
            : c))

          // Sonido de mensaje (solo si no es mío y el sonido está activado)
          if (msg.senderId !== MY_ID && loadNotifSettings().sonido) {
            const file = msg.conversationId === activeIdRef.current
              ? 'sound_response_message'  // estoy dentro de la conversación → respuesta
              : 'sound_message'           // mensaje nuevo en otra conversación
            new Audio(`/assets/sounds/${file}.mp3`).play().catch(() => { /* autoplay bloqueado */ })
          }

          // Ack de entrega: si el mensaje no es mío, aviso que me llegó (doble flecha gris).
          if (msg.senderId !== MY_ID) {
            chatApi.markDelivered(msg.conversationId).catch(() => {})
          }
          break
        }
        case 'conversation:delivered': {
          const convId = String(data.conversationId)
          if (String(data.userId) === MY_ID) break
          const t = new Date(data.deliveredAt).getTime()
          setMessages(prev => ({
            ...prev,
            [convId]: (prev[convId] ?? []).map(m =>
              m.senderId === MY_ID && m.status !== 'read' && new Date(m.createdAt).getTime() <= t
                ? { ...m, status: 'delivered' } : m),
          }))
          break
        }
        case 'conversation:read': {
          const convId = String(data.conversationId)
          if (String(data.userId) === MY_ID) break
          const t = new Date(data.readAt).getTime()
          setMessages(prev => ({
            ...prev,
            [convId]: (prev[convId] ?? []).map(m =>
              m.senderId === MY_ID && new Date(m.createdAt).getTime() <= t
                ? { ...m, status: 'read' } : m),
          }))
          break
        }
        case 'message:edited':
          patchMessage(String(data.messageId), { content: data.content, edited: true, editedAt: data.editedAt ?? undefined })
          break
        case 'message:deleted':
          patchMessage(String(data.messageId), { deleted: true })
          break
        case 'message:priority':
          patchMessage(String(data.messageId), { priority: data.priority as MessagePriority })
          break
        case 'reaction:updated':
          patchMessage(String(data.messageId), { reactions: mapReactions(data.reactions ?? {}) })
          break
        case 'message:pinned': {
          const convId    = String(data.conversationId)
          const pinnedId  = data.messageId != null ? String(data.messageId) : null
          setMessages(prev => ({
            ...prev,
            [convId]: (prev[convId] ?? []).map(m => ({ ...m, pinned: m.id === pinnedId })),
          }))
          break
        }
        case 'conversation:new': {
          const conv = mapConversation(data.conversation)
          setConversations(prev => prev.some(c => c.id === conv.id) ? prev : [conv, ...prev])
          break
        }
        case 'conversation:updated': {
          const conv = mapConversation(data.conversation)
          setConversations(prev => prev.map(c => c.id === conv.id ? conv : c))
          break
        }
        case 'member:left': {
          const convId = String(data.conversationId)
          const userId = String(data.userId)
          if (userId === MY_ID) {
            setConversations(prev => prev.filter(c => c.id !== convId))
            if (activeIdRef.current === convId) setActiveId(null)
          } else {
            setConversations(prev => prev.map(c => c.id === convId
              ? { ...c, members: c.members.filter(m => m.id !== userId) } : c))
          }
          break
        }
        case 'typing': {
          const convId = String(data.conversationId)
          if (String(data.userId) === MY_ID) break
          setTypingByConv(prev => {
            const current = new Set(prev[convId] ?? [])
            if (data.typing) current.add(data.userName)
            else             current.delete(data.userName)
            return { ...prev, [convId]: [...current] }
          })
          break
        }
        case 'presence:init': {
          const ids = (data.onlineUserIds as number[]).map(String)
          setOnlineUserIds(new Set(ids))
          break
        }
        case 'user:online': {
          const uid = String(data.userId)
          setOnlineUserIds(prev => { const next = new Set(prev); next.add(uid); return next })
          break
        }
        case 'user:offline': {
          const uid = String(data.userId)
          setOnlineUserIds(prev => { const next = new Set(prev); next.delete(uid); return next })
          break
        }
      }
    }

    return () => { ws.close() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeConversation = conversations.find(c => c.id === activeId) ?? null
  const activeMessages     = (activeId ? (messages[activeId] ?? []) : []).filter(m => !m.deleted)
  const pinnedMessage      = activeMessages.find(m => m.pinned) ?? null
  const isCreator          = activeConversation?.createdBy === MY_ID
  const typingUsers        = activeId ? (typingByConv[activeId] ?? []) : []

  const mediaFiles = activeMessages.flatMap(m => (m.attachments ?? []).filter(a => a.type === 'image' || a.type === 'video'))
  const docFiles   = activeMessages.flatMap(m => (m.attachments ?? []).filter(a => a.type === 'document' || a.type === 'file'))

  const filteredConversations = conversations.filter(c => {
    const name = c.type === 'group' ? (c.name ?? '') : c.members.find(m => m.id !== MY_ID)?.name ?? ''
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const canEdit = (msg: ChatMessage) =>
    msg.senderId === MY_ID && Date.now() - new Date(msg.createdAt).getTime() < 20 * 60 * 1000

  const openConversation = useCallback(async (id: string) => {
    setActiveId(id)
    setReplyTo(null)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c))
    const msgs = await getMessages.execute(id).catch(() => [])
    setMessages(prev => ({ ...prev, [id]: msgs }))
    markRead.execute(id).catch(() => {})
  }, [])

  // Sonido al ENVIAR un mensaje (solo al enviar, no en entregado/leído).
  const playSendSound = () => {
    if (loadNotifSettings().sonido) {
      new Audio('/assets/sounds/send_message.mp3').play().catch(() => {})
    }
  }

  // El estado se actualiza por los eventos WS; aquí solo enviamos el comando REST.
  const send = useCallback(async (content: string) => {
    if (!content.trim() || !activeId) return
    const reply = replyTo ?? undefined
    setReplyTo(null)
    playSendSound()
    await sendMessage.execute(activeId, { content, replyTo: reply }).catch(() => {})
  }, [activeId, replyTo])

  const sendFiles = useCallback(async (files: File[]) => {
    if (!activeId) return
    playSendSound()
    for (const file of files) {
      try {
        const attachment = await uploadFile.execute(file)
        await sendMessage.execute(activeId, { content: '', attachments: [attachment] })
      } catch { /* ignore */ }
    }
  }, [activeId])

  const sendSticker = useCallback(async (assetUrl: string) => {
    if (!activeId) return
    try {
      const res  = await fetch(assetUrl)
      const blob = await res.blob()
      const filename = assetUrl.split('/').pop() ?? 'sticker.webp'
      const file = new File([blob], filename, { type: blob.type || 'image/webp' })
      const attachment = await uploadFile.execute(file)
      const reply = replyTo ?? undefined
      setReplyTo(null)
      playSendSound()
      await sendMessage.execute(activeId, {
        content:     '',
        attachments: [{ ...attachment, type: 'sticker' }],
        replyTo:     reply,
      })
    } catch { /* ignore */ }
  }, [activeId, replyTo])

  const edit = useCallback(async (msgId: string, content: string) => {
    await editMessage.execute(msgId, { content }).catch(() => {})
    sileo.success({ title: 'Mensaje editado', ...TOAST_STYLE })
  }, [])

  const remove = useCallback(async (msgId: string) => {
    await deleteMessage.execute(msgId).catch(() => {})
    sileo.success({ title: 'Mensaje eliminado', ...TOAST_STYLE })
  }, [])

  const pin = useCallback(async (msgId: string) => {
    const pinned = await pinMessage.execute(msgId).catch(() => null)
    if (pinned !== null) sileo.success({ title: pinned ? 'Mensaje fijado' : 'Mensaje desfijado', ...TOAST_STYLE })
  }, [])

  const priority = useCallback(async (msgId: string, p: MessagePriority) => {
    await setPriorityUC.execute(msgId, { priority: p }).catch(() => {})
    const labels: Record<MessagePriority, string> = { normal: 'Normal', important: 'Importante', urgent: 'Urgente' }
    sileo.success({ title: `Marcado como ${labels[p]}`, ...TOAST_STYLE })
  }, [])

  const react = useCallback(async (msgId: string, emoji: string) => {
    await toggleReaction.execute(msgId, { emoji }).catch(() => {})
  }, [])

  const leave = useCallback(async (id: string) => {
    await leaveConversation.execute(id).catch(() => {})
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeId === id) setActiveId(null)
    sileo.success({ title: 'Saliste del chat', description: 'Ya no recibirás mensajes de este grupo.', ...TOAST_STYLE })
  }, [activeId])

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      const attachment = await uploadFile.execute(file)
      return attachment.url
    } catch {
      return ''
    }
  }, [])

  const updateGroup = useCallback(async (fields: { name?: string; description?: string; avatar?: string }) => {
    if (!activeId) return
    const updated = await updateConversation.execute(activeId, fields).catch(() => null)
    if (updated) setConversations(prev => prev.map(c => c.id === updated.id ? updated : c))
    sileo.success({ title: 'Grupo actualizado', ...TOAST_STYLE })
  }, [activeId])

  const create = useCallback(async (type: 'personal' | 'group', memberIds: string[], groupName?: string) => {
    const conv = await createConversation.execute({ type, memberIds, name: groupName }).catch(() => null)
    if (!conv) return
    setConversations(prev => prev.some(c => c.id === conv.id) ? prev : [conv, ...prev])
    setMessages(prev => ({ ...prev, [conv.id]: [] }))
    setActiveId(conv.id)
    setNewConvModal(false)
  }, [])

  const notifyTyping = useCallback((isTyping: boolean) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN || !activeId) return
    ws.send(JSON.stringify({ type: isTyping ? 'typing:start' : 'typing:stop', conversationId: Number(activeId) }))
  }, [activeId])

  const addMembers = useCallback(async (conversationId: string, userIds: string[]) => {
    if (userIds.length === 0) return
    try {
      const updated = await chatApi.addMembers(conversationId, userIds)
      setConversations(prev => prev.map(c => c.id === conversationId ? updated : c))
    } catch { /* ignore */ }
  }, [])

  return {
    conversations: filteredConversations,
    activeConversation,
    activeMessages,
    availableMembers: contacts,
    pinnedMessage,
    typingUsers,
    newConvModal,
    searchQuery,
    isCreator,
    canEdit,
    MY_ID,
    replyTo,
    mediaFiles,
    docFiles,
    setSearchQuery,
    setNewConvModal,
    setReplyTo,
    notifyTyping,
    openConversation,
    sendMessage:        send,
    sendFiles,
    sendSticker,
    editMessage:        edit,
    deleteMessage:      remove,
    pinMessage:         pin,
    setPriority:        priority,
    addReaction:        react,
    leaveConversation:  leave,
    updateGroupInfo:    updateGroup,
    createConversation: create,
    addMembers,
    uploadImage,
    onlineUserIds,
  }
}
