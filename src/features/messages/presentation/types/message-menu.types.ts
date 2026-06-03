import type { ChatMessage } from '../../domain/models/ChatMessage'
import type { MessagePriority } from '../../domain/models/Chat.types'

export interface MessageMenuProps {
  msg:        ChatMessage
  isMe:       boolean
  canEdit:    boolean
  isCreator:  boolean
  onReply:    () => void
  onEdit:     () => void
  onDelete:   () => void
  onPin:      () => void
  onPriority: (p: MessagePriority) => void
  onClose:    () => void
}
