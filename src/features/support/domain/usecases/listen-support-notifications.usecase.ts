import type { SupportNotificationsRepository } from '../repositories/SupportNotificationsRepository'
import type { SupportNotification }            from '../models/SupportNotification'
import type { SocketConnectionStatus } from '../../../../core/network/sockeClient.types'

export class ListenSupportNotificationsUseCase {
  private readonly repo: SupportNotificationsRepository

  constructor(repo: SupportNotificationsRepository) {
    this.repo = repo
  }

  onNotification(cb: (n: SupportNotification) => void): () => void {
    return this.repo.onNotification(cb)
  }

  onStatusChange(cb: (s: SocketConnectionStatus) => void): () => void {
    return this.repo.onStatusChange(cb)
  }
}