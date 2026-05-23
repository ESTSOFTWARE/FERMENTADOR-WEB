export interface GroupMember {
  id:             number
  student_id:     number
  name:           string
  last_name:      string
  email:          string
  joined_at:      string | null
  oauth_provider: 'google' | 'github' | 'email'
}

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

export interface CreateGroupRequest {
  name:    string
  subject: string
}

export interface AddMemberRequest {
  student_id: number
}
