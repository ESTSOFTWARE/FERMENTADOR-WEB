// Contrato real de /ws/support-chat (backend en src/services/support_chat).
// Interfaz plana (no unión discriminada): el backend siempre manda `type`
// más los campos propios de ese evento; el resto queda opcional/ausente.
// Se evita una unión con miembro comodín porque rompe el narrowing del
// switch en el mapper (TS no puede descartar esa rama).
export interface SupportMessageEventDto {
  id:             number
  conversationId: number
  senderId:       number
  senderName:     string
  senderRole:     'admin' | 'soporte'
  content:        string | null
  createdAt:      string
}

export interface SupportConversationEventDto {
  id:        number
  adminId:   number
  adminName: string
}

export interface SupportEventDto {
  type:           string
  message?:       SupportMessageEventDto
  conversation?:  SupportConversationEventDto
  conversationId?: number
  role?:          'admin' | 'soporte'
  typing?:        boolean
  [key: string]: unknown // margen para campos futuros que el backend agregue
}