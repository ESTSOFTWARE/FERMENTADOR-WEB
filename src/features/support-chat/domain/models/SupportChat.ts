export type AttachmentType = 'image' | 'video' | 'document' | 'file'
export type SupportRole = 'admin' | 'soporte'
export type SupportStatus = 'pending' | 'answered'

export interface SupportAttachment {
  id:   number
  type: AttachmentType
  name: string
  url:  string
  size: number
}

export interface SupportMessage {
  id:             number
  conversationId: number
  senderId:       number
  senderName:     string
  senderRole:     SupportRole
  content:        string | null
  createdAt:      string
  read:           boolean
  attachments:    SupportAttachment[]
}

export interface SupportConversation {
  id:           number
  adminId:      number
  adminName:    string
  adminEmail:   string
  createdAt:    string
  lastMessage:  SupportMessage | null
  unreadCount:  number
}

/** Estado derivado para la UI: respondido si el último mensaje es de soporte. */
export const deriveStatus = (c: SupportConversation): SupportStatus =>
  c.lastMessage && c.lastMessage.senderRole === 'soporte' ? 'answered' : 'pending'
