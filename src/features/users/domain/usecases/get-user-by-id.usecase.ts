import type { UserRepository } from '../repositories/UserRepository'
import type { User }           from '../../models/entities/User'

export class GetUserByIdUseCase {
  private readonly repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<User> {
    return this.repository.getById(id)
  }
}
