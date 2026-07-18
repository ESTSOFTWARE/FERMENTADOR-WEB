export type SupportNotificationKind =
  | 'new_message'  // message:new — el otro lado respondió
  | 'new_ticket'   // conversation:new — un admin abrió conversación por primera vez (solo soporte)

export interface SupportNotification {
  id:             string
  kind:           SupportNotificationKind
  title:          string
  description:    string
  conversationId: number | null
  createdAt:      string
  read:           boolean
}