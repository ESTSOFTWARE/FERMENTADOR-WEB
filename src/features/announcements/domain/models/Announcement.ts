export interface Announcement {
  id:           number
  label:        string
  version:      string
  date:         string
  title:        string
  description:  string
  created_at:   string | null
  is_pinned:    boolean
  pinned_until: string | null
}
