import type { MessageReplyTo } from '../../domain/models/MessageReplyTo'

export interface ChatComposerProps {
  replyTo:       MessageReplyTo | null
  onCancelReply: () => void
  onSend:        (content: string) => void
  onSendFiles:   (files: File[]) => void
  onTyping:      (value: string) => void
}
