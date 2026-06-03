import type { CreateConversationRequest } from '../../domain/dtos/request/create-conversation.request'
import type { UpdateConversationRequest } from '../../domain/dtos/request/update-conversation.request'
import type { SendMessageRequest }        from '../../domain/dtos/request/send-message.request'
import type { EditMessageRequest }        from '../../domain/dtos/request/edit-message.request'
import type { SetPriorityRequest }        from '../../domain/dtos/request/set-priority.request'
import type { ReactionRequest }           from '../../domain/dtos/request/reaction.request'
import type { Conversation }              from '../../domain/models/Conversation'
import type { ChatMessage }               from '../../domain/models/ChatMessage'
import type { ChatMember }                from '../../domain/models/ChatMember'
import type { MessageAttachment }         from '../../domain/models/MessageAttachment'
import type { MessageReplyTo }            from '../../domain/models/MessageReplyTo'
import type { UserRole, MessagePriority } from '../../domain/models/Chat.types'
import { apiClient }                      from '../../../../core/network/client'

/* ── Shapes crudos del backend (IDs en int, camelCase) ───────────────────────── */
interface RawAttachment { id: number; type: MessageAttachment['type']; name: string; url: string; size: number }
interface RawReply      { id: number; content: string | null; senderName: string; attachment: RawAttachment | null }
interface RawMessage {
  id: number; conversationId: number; senderId: number; senderName: string; senderRole: string
  content: string | null; createdAt: string; read: boolean; deleted: boolean; edited: boolean
  editedAt: string | null; pinned: boolean; priority: string
  attachments: RawAttachment[]; replyTo: RawReply | null; reactions: Record<string, number[]>
}
interface RawMember  { id: number; name: string; role: string; avatar: string | null }
interface RawConversation {
  id: number; type: string; name: string | null; description: string | null; avatar: string | null
  members: RawMember[]; lastMessage: RawMessage | null; unreadCount: number; createdAt: string; createdBy: number
}
interface RawUpload  { id: number; type: string; name: string; url: string; size: number }

/* ── Mappers int → string ────────────────────────────────────────────────────── */
const mapAttachment = (a: RawAttachment): MessageAttachment => ({
  id: String(a.id), type: a.type, name: a.name, url: a.url, size: a.size,
})
const mapReply = (r: RawReply | null): MessageReplyTo | undefined =>
  r ? { id: String(r.id), content: r.content ?? '', senderName: r.senderName, attachment: !!r.attachment } : undefined
export const mapReactions = (rx: Record<string, number[]>): Record<string, string[]> =>
  Object.fromEntries(Object.entries(rx).map(([emoji, ids]) => [emoji, ids.map(String)]))

export const mapMessage = (m: RawMessage): ChatMessage => ({
  id:             String(m.id),
  conversationId: String(m.conversationId),
  senderId:       String(m.senderId),
  senderName:     m.senderName,
  senderRole:     m.senderRole as UserRole,
  content:        m.content ?? '',
  createdAt:      m.createdAt,
  read:           m.read,
  deleted:        m.deleted,
  edited:         m.edited,
  editedAt:       m.editedAt ?? undefined,
  pinned:         m.pinned,
  priority:       m.priority as MessagePriority,
  attachments:    (m.attachments ?? []).map(mapAttachment),
  replyTo:        mapReply(m.replyTo),
  reactions:      mapReactions(m.reactions ?? {}),
})
const mapMember = (m: RawMember): ChatMember => ({
  id: String(m.id), name: m.name, role: m.role as UserRole, avatar: m.avatar ?? undefined,
})
export const mapConversation = (c: RawConversation): Conversation => ({
  id:          String(c.id),
  type:        c.type as Conversation['type'],
  name:        c.name ?? undefined,
  description: c.description ?? undefined,
  avatar:      c.avatar ?? undefined,
  members:     (c.members ?? []).map(mapMember),
  lastMessage: c.lastMessage ? mapMessage(c.lastMessage) : undefined,
  unreadCount: c.unreadCount,
  createdAt:   c.createdAt,
  createdBy:   String(c.createdBy),
})

/* ── API REST (BASE_URL ya incluye /api) ─────────────────────────────────────── */
export const chatApi = {
  getConversations: async (): Promise<Conversation[]> =>
    (await apiClient.get<RawConversation[]>('/chat/conversations')).map(mapConversation),

  getContacts: async (): Promise<ChatMember[]> =>
    (await apiClient.get<RawMember[]>('/chat/contacts')).map(mapMember),

  createConversation: async (data: CreateConversationRequest): Promise<Conversation> =>
    mapConversation(await apiClient.post<RawConversation>('/chat/conversations', {
      type:        data.type,
      memberIds:   data.memberIds.map(Number),
      name:        data.name,
      description: data.description,
    })),

  updateConversation: async (id: string, data: UpdateConversationRequest): Promise<Conversation> =>
    mapConversation(await apiClient.patch<RawConversation>(`/chat/conversations/${id}`, data)),

  leaveConversation: (id: string): Promise<void> =>
    apiClient.delete<void>(`/chat/conversations/${id}/leave`),

  markRead: (conversationId: string): Promise<void> =>
    apiClient.post<void>(`/chat/conversations/${conversationId}/read`),

  getMessages: async (conversationId: string): Promise<ChatMessage[]> =>
    (await apiClient.get<RawMessage[]>(`/chat/conversations/${conversationId}/messages`)).map(mapMessage),

  sendMessage: async (conversationId: string, data: SendMessageRequest): Promise<ChatMessage> =>
    mapMessage(await apiClient.post<RawMessage>(`/chat/conversations/${conversationId}/messages`, {
      content:     data.content,
      attachments: (data.attachments ?? []).map(a => ({ id: Number(a.id), type: a.type, name: a.name, url: a.url, size: a.size ?? 0 })),
      replyToId:   data.replyTo ? Number(data.replyTo.id) : undefined,
    })),

  editMessage: async (messageId: string, data: EditMessageRequest): Promise<ChatMessage> =>
    mapMessage(await apiClient.patch<RawMessage>(`/chat/messages/${messageId}`, data)),

  deleteMessage: (messageId: string): Promise<void> =>
    apiClient.delete<void>(`/chat/messages/${messageId}`),

  pinMessage: async (messageId: string): Promise<boolean> =>
    (await apiClient.post<{ messageId: number; pinned: boolean }>(`/chat/messages/${messageId}/pin`)).pinned,

  setPriority: (messageId: string, data: SetPriorityRequest): Promise<void> =>
    apiClient.patch<void>(`/chat/messages/${messageId}/priority`, data),

  toggleReaction: async (messageId: string, data: ReactionRequest): Promise<Record<string, string[]>> =>
    mapReactions((await apiClient.post<{ messageId: number; reactions: Record<string, number[]> }>(`/chat/messages/${messageId}/reactions`, data)).reactions),

  uploadFile: async (file: File): Promise<MessageAttachment> => {
    const form = new FormData()
    form.append('file', file)
    const raw = await apiClient.upload<RawUpload>('/chat/uploads', form)
    return { id: String(raw.id), type: raw.type as MessageAttachment['type'], name: raw.name, url: raw.url, size: raw.size }
  },
}
