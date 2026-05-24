export interface GroupMember {
  id:             number
  student_id:     number
  name:           string
  last_name:      string
  email:          string
  joined_at:      string | null
  oauth_provider: 'google' | 'github' | 'email'
}
