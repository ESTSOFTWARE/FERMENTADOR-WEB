import type { GroupMember } from './GroupMember'

export interface Group {
  id:           number
  name:         string
  subject:      string
  cover_image:  string | null
  professor_id: number
  code:         string
  created_at:   string | null
  members:      GroupMember[]
}
