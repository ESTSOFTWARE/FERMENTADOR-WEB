import type { MessageAttachment } from '../../models/MessageAttachment'
import type { MessageReplyTo }    from '../../models/MessageReplyTo'

export interface SendMessageRequest {
  content:      string
  attachments?: MessageAttachment[]
  replyTo?:     MessageReplyTo
}
