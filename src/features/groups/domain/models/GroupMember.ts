export interface GroupMember {
  id:             number
  student_id:     number
  name:           string
  last_name:      string
  email:          string
  avatar:         string | null
  joined_at:      string | null
  oauth_provider: 'google' | 'github' | 'email'
  dial_code:      string | null
  phone_number:   string | null
  description:    string | null
}
