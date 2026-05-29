import { userApi }             from '../api/userApi'
import type { UserRepository } from '../../domain/repositories/UserRepository'
import type { UserRequest }    from '../../models/dto/UserRequest'
import type { UserResponse }   from '../../models/dto/UserResponse'
import type { User }           from '../../models/entities/User'

export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<User[]> {
    return userApi.getAll()
  }

  async getById(id: number): Promise<User> {
    return userApi.getById(id)
  }

  async create(data: UserRequest): Promise<UserResponse> {
    return userApi.create(data)
  }

  async update(id: number, data: Partial<UserRequest>): Promise<UserResponse> {
    return userApi.update(id, data)
  }

  async delete(id: number): Promise<void> {
    return userApi.delete(id)
  }
}
