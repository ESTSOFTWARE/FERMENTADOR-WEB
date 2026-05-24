export type ReportHistoryItem = {
  id:          number
  report_id:   number
  user_id:     number
  action:      string
  occurred_at: string | null
}
