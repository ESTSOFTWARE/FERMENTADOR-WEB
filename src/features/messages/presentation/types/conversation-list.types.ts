import type { Conversation } from '../../domain/models/Conversation'

export interface ConversationListProps {
  conversations: Conversation[]
  activeId:      string | null
  searchQuery:   string
  onSearch:      (q: string) => void
  onOpen:        (id: string) => void
  onNew:         () => void
}
