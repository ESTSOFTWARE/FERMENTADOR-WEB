export interface MessageReplyTo {
  id:              string
  content:         string
  senderName:      string
  attachment?:     boolean
  attachmentUrl?:  string
  attachmentType?: string
}
