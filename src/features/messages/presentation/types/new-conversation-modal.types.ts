import type { ChatMember } from '../../domain/models/ChatMember'

export interface NewConversationModalProps {
  open:     boolean
  members:  ChatMember[]
  onClose:  () => void
  onCreate: (type: 'personal' | 'group', memberIds: string[], groupName?: string) => void
}
