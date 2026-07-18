import type { SupportEventDto }     from '../dto/support-notification.dto'
import type { SupportNotification } from '../../domain/models/SupportNotification'

// Traduce eventos del canal "support" a notificaciones de dominio.
// 'read' y 'typing' no son notificaciones → null.
// 'conversation:new' solo aplica a soporte (es quien recibe ese evento del backend).
export const mapSupportEventToNotification = (
  dto: SupportEventDto,
  viewerRole: 'admin' | 'soporte',
): SupportNotification | null => {
  switch (dto.type) {
    case 'message:new': {
      const msg = dto.message
      if (!msg) return null
      if (msg.senderRole === viewerRole) return null // no notificar mensajes propios

      const title = msg.senderRole === 'soporte'
        ? 'El equipo de soporte respondió tu solicitud'
        : `${msg.senderName} te envió un nuevo mensaje`

      return {
        id:             `msg-${msg.id}`,
        kind:           'new_message',
        title,
        description:    msg.content ?? 'Adjuntó un archivo',
        conversationId: msg.conversationId,
        createdAt:      msg.createdAt,
        read:           false,
      }
    }

    case 'conversation:new': {
      // El backend solo emite este evento a los agentes de soporte.
      if (viewerRole !== 'soporte') return null
      const conv = dto.conversation
      if (!conv) return null

      return {
        id:             `conv-${conv.id}`,
        kind:           'new_ticket',
        title:          'Nuevo chat de soporte',
        description:    `${conv.adminName} inició una nueva conversación.`,
        conversationId: conv.id,
        createdAt:      new Date().toISOString(),
        read:           false,
      }
    }

    // 'read' → confirmación de lectura del otro lado, no es notificación.
    // 'typing' → indicador efímero, no es notificación.
    default:
      return null
  }
}