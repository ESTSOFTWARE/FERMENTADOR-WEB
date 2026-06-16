import { userApi }             from '../api/userApi'
import type { UserRepository } from '../../domain/repositories/UserRepository'
import type { UserRequest }    from '../../models/dto/UserRequest'
import type { UserResponse }   from '../../models/dto/UserResponse'
import type { User, Role }     from '../../models/entities/User'

// El backend manda role_name en minúscula ('estudiante'); el front usa
// 'Administrador' | 'Profesor' | 'Estudiante'. Normalizamos por role_id (estable).
const ROLE_BY_ID: Record<number, Role> = {
  1: 'Administrador',
  2: 'Profesor',
  3: 'Estudiante',
}
const normalize = (u: User): User => ({
  ...u,
  role_name: ROLE_BY_ID[u.role_id] ?? u.role_name,
})

export class UserRepositoryImpl implements UserRepository {
  async getAll(): Promise<User[]> {
    return (await userApi.getAll()).map(normalize)
  }

  async getById(id: number): Promise<User> {
    return normalize(await userApi.getById(id))
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
