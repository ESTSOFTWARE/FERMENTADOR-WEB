import type { UserRepository } from '../repositories/UserRepository'
import type { UserResponse }   from '../../models/dto/UserResponse'

interface UpdateUserInput {
  name:      string
  last_name: string
  email:     string
  role_name: string
}

export class UpdateUserUseCase {
  private readonly repository: UserRepository

  constructor(repository: UserRepository) {
    this.repository = repository
  }

  execute(id: number, data: UpdateUserInput): Promise<UserResponse> {
    return this.repository.update(id, {
      name:      data.name,
      last_name: data.last_name,
      email:     data.email,
      role:      data.role_name.toLowerCase(),
    })
  }
}
