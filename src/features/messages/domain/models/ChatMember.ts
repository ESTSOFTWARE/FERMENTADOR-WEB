import type { UserRole } from './Chat.types'

export interface ChatMember {
  id:      string
  name:    string
  role:    UserRole
  avatar?: string
}
