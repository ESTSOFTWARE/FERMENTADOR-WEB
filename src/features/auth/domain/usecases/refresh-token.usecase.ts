import type { AuthRepository } from '../repositories/AuthRepository'

export class RefreshTokenUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async execute(): Promise<void> {
    await this.repository.refreshToken()
  }
}
