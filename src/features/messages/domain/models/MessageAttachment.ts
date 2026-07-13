export interface MessageAttachment {
  id:    string
  type:  'image' | 'video' | 'document' | 'file' | 'sticker'
  name:  string
  url:   string
  size?: number
}
