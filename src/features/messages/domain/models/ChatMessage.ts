import type { UserRole, MessagePriority } from './Chat.types'
import type { MessageAttachment } from './MessageAttachment'
import type { MessageReplyTo } from './MessageReplyTo'

export interface ChatMessage {
  id:             string
  conversationId: string
  senderId:       string
  senderName:     string
  senderRole:     UserRole
  content:        string
  createdAt:      string
  read:           boolean
  status?:        'sent' | 'delivered' | 'read'
  deleted?:       boolean
  edited?:        boolean
  editedAt?:      string
  pinned?:        boolean
  priority?:      MessagePriority
  attachments?:   MessageAttachment[]
  replyTo?:       MessageReplyTo
  reactions?:     Record<string, string[]>
}
