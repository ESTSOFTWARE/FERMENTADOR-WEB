import type { SupportNotificationsRepository } from '../repositories/SupportNotificationsRepository'

export class ConnectSupportNotificationsUseCase {
  private readonly repo: SupportNotificationsRepository

  constructor(repo: SupportNotificationsRepository) {
    this.repo = repo
  }

  execute(): void { this.repo.connect() }
}