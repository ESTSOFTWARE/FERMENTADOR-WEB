import type { AuthRepository } from '../repositories/AuthRepository'
import type { AuthUser }       from '../models/Auth'

export class LoginUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async execute(email: string, password: string): Promise<AuthUser> {
    const { user } = await this.repository.login({ email, password })
    localStorage.setItem('user_data', JSON.stringify(user))
    return user
  }
}
