import { MY_ID } from '../constants/current-user.constants'
import { avatarUrl } from './avatar-url'
import type { Conversation } from '../../domain/models/Conversation'

export const getConvAvatar = (conv: Conversation, myId: string = MY_ID): string | null => {
  if (conv.avatar) return conv.avatar
  if (conv.type === 'personal') {
    const other = conv.members.find(m => m.id !== myId)
    return other ? avatarUrl(other.name) : null
  }
  return null
}
