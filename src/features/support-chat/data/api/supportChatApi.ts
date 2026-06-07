import { apiClient } from '../../../../core/network/client'
import type {
  SupportAttachment,
  SupportConversation,
  SupportMessage,
} from '../../domain/models/SupportChat'

export const supportChatApi = {
  // Agente de soporte: cola de conversaciones
  listConversations: (): Promise<SupportConversation[]> =>
    apiClient.get<SupportConversation[]>('/support-chat/conversations'),

  // Admin: su conversación con soporte (crea si no existe)
  myConversation: (): Promise<SupportConversation> =>
    apiClient.get<SupportConversation>('/support-chat/me'),

  getMessages: (conversationId: number, cursor?: number, limit = 50): Promise<SupportMessage[]> => {
    const q = new URLSearchParams({ limit: String(limit) })
    if (cursor) q.set('cursor', String(cursor))
    return apiClient.get<SupportMessage[]>(`/support-chat/conversations/${conversationId}/messages?${q}`)
  },

  sendMessage: (
    conversationId: number,
    content: string | null,
    attachments: SupportAttachment[] = [],
  ): Promise<SupportMessage> =>
    apiClient.post<SupportMessage>(`/support-chat/conversations/${conversationId}/messages`, {
      content,
      attachments,
    }),

  markRead: (conversationId: number): Promise<void> =>
    apiClient.post<void>(`/support-chat/conversations/${conversationId}/read`, {}),

  upload: (file: File): Promise<SupportAttachment> => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.upload<SupportAttachment>('/support-chat/uploads', form)
  },
}
