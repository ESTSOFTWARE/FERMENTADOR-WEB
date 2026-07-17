import { SupportNotificationsSocketDatasource } from '../datasources/SupportNotificationsSocketDatasource'
import { mapSupportEventToNotification }        from '../mappers/support-notification.mapper'
import type { SupportNotificationsRepository }  from '../../domain/repositories/SupportNotificationsRepository'
import type { SupportNotification }             from '../../domain/models/SupportNotification'
import type { SocketConnectionStatus } from '../../../../core/network/sockeClient.types'

export class SupportNotificationsRepositoryImpl implements SupportNotificationsRepository {
  private readonly datasource: SupportNotificationsSocketDatasource
  private readonly viewerRole: 'admin' | 'soporte'

  constructor(datasource: SupportNotificationsSocketDatasource, viewerRole: 'admin' | 'soporte') {
    this.datasource = datasource
    this.viewerRole = viewerRole
  }

  connect(): void { this.datasource.connect() }
  disconnect(): void { this.datasource.disconnect() }
  getStatus(): SocketConnectionStatus { return this.datasource.getStatus() }

  onStatusChange(cb: (s: SocketConnectionStatus) => void): () => void {
    return this.datasource.onStatusChange(cb)
  }

  onNotification(cb: (n: SupportNotification) => void): () => void {
    return this.datasource.onEvent((dto) => {
      const notification = mapSupportEventToNotification(dto, this.viewerRole)
      if (notification) cb(notification)
    })
  }
}