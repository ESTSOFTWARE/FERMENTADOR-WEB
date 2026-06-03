import type { ChatMember } from './ChatMember'
import type { ChatMessage } from './ChatMessage'

export interface Conversation {
  id:           string
  type:         'personal' | 'group'
  name?:        string
  description?: string
  avatar?:      string
  members:      ChatMember[]
  lastMessage?: ChatMessage
  unreadCount:  number
  createdAt:    string
  createdBy:    string
}
