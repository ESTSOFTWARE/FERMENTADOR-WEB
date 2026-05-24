import type { AuthRepository } from '../repositories/AuthRepository'

export class RefreshTokenUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async execute(refreshToken: string): Promise<string> {
    const { access_token } = await this.repository.refreshToken({ refresh_token: refreshToken })
    localStorage.setItem('access_token', access_token)
    return access_token
  }
}
