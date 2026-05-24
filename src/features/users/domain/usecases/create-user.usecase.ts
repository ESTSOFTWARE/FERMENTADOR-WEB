import type { UserRepository } from '../repositories/UserRepository'
import type { UserRequest }    from '../../models/dto/UserRequest'
import type { UserResponse }   from '../../models/dto/UserResponse'

export class CreateUserUseCase {
  private readonly repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  execute(data: UserRequest): Promise<UserResponse> {
    return this.repository.create(data)
  }
}
