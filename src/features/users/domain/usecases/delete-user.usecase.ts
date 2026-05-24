import type { UserRepository } from '../repositories/UserRepository'

export class DeleteUserUseCase {
  private readonly repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
