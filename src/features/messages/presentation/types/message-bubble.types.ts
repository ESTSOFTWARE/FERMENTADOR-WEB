import type { ChatMessage } from '../../domain/models/ChatMessage'
import type { MessagePriority } from '../../domain/models/Chat.types'

export interface MessageBubbleProps {
  msg:        ChatMessage
  isFirst:    boolean
  isLast:     boolean
  groupChat:  boolean
  canEdit:    boolean
  isCreator:  boolean
  editing:           boolean
  editContent:       string
  onEditChange:      (v: string) => void
  onEditSubmit:      () => void
  onEditCancel:      () => void
  menuOpen:          boolean
  reactionOpen:      boolean
  onToggleMenu:      () => void
  onToggleReaction:  () => void
  onCloseMenu:       () => void
  onReply:           () => void
  onReactQuick:      (emoji: string) => void
  onEditStart:       () => void
  onRequestDelete:   () => void
  onRequestPin:      () => void
  onRequestPriority: (p: MessagePriority) => void
}
