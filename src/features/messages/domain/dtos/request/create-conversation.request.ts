export interface CreateConversationRequest {
  type:        'personal' | 'group'
  memberIds:   string[]
  name?:       string
  description?: string
}
