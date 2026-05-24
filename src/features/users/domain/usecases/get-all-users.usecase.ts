import type { UserRepository } from '../repositories/UserRepository'
import type { User }           from '../../models/entities/User'

export class GetAllUsersUseCase {
  private readonly repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  execute(): Promise<User[]> {
    return this.repository.getAll()
  }
}
