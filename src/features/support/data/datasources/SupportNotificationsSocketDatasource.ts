import { createSocketClient } from '../../../../core/network/createSocketClient'
import type { SocketClient, SocketConnectionStatus } from '../../../../core/network/sockeClient.types'
import type { SupportEventDto } from '../dto/support-notification.dto'

/**
 * Única responsabilidad: hablar con el socket del canal de soporte
 * (/ws/support-chat) y entregar los eventos crudos ya parseados a JSON.
 * No conoce modelos de dominio ni UI.
 */
export class SupportNotificationsSocketDatasource {
  private readonly client: SocketClient

  constructor() {
    // Mismo path que usa el chat (/ws/support-chat → channel "support"),
    // pero conexión propia y aislada para el flujo de notificaciones.
    this.client = createSocketClient('support-chat')
  }

  connect(): void {
    this.client.connect()
  }

  disconnect(): void {
    this.client.disconnect()
  }

  getStatus(): SocketConnectionStatus {
    return this.client.getStatus()
  }

  onStatusChange(cb: (status: SocketConnectionStatus) => void): () => void {
    return this.client.onStatusChange(cb)
  }

  onEvent(cb: (dto: SupportEventDto) => void): () => void {
    return this.client.onMessage((raw) => {
      let dto: SupportEventDto
      try {
        dto = JSON.parse(raw)
      } catch {
        return // evento malformado: se descarta sin romper el stream
      }
      if (!dto?.type) return
      cb(dto)
    })
  }
}