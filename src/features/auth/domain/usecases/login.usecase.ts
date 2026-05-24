import type { AuthRepository } from '../repositories/AuthRepository'
import type { AuthUser }       from '../models/Auth'

export class LoginUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async execute(email: string, password: string): Promise<AuthUser> {
    const data = await this.repository.login({ email, password })

    localStorage.setItem('access_token',  data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('user_data',     JSON.stringify(data.user))

    return data.user
  }
}
