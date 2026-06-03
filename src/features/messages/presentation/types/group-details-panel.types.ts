import type { Conversation } from '../../domain/models/Conversation'
import type { MessageAttachment } from '../../domain/models/MessageAttachment'

export interface GroupDetailsPanelProps {
  conv:         Conversation
  isCreator:    boolean
  mediaFiles:   MessageAttachment[]
  docFiles:     MessageAttachment[]
  onClose:      () => void
  onLeave:      () => void
  onUpdateInfo: (f: { name?: string; description?: string; avatar?: string }) => void
}
