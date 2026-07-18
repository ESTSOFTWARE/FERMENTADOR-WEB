import type { SupportNotificationsRepository } from '../repositories/SupportNotificationsRepository'

export class DisconnectSupportNotificationsUseCase {
  private readonly repo: SupportNotificationsRepository

  constructor(repo: SupportNotificationsRepository) {
    this.repo = repo
  }

  execute(): void { this.repo.disconnect() }
}