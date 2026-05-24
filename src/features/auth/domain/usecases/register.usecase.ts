import type { AuthRepository } from '../repositories/AuthRepository'

export class RegisterUseCase {
  private readonly repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async execute(name: string, lastName: string, email: string, password: string): Promise<string> {
    await this.repository.register({ name, last_name: lastName, email, password })
    return email
  }
}
