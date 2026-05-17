import { profileApi } from '../api/profileApi'
import type { ProfileRepository } from '../../domain/repositories/ProfileRepository'
import type {
  UpdateUserRequest,
  ActivateCircuitRequest,
  ActivateCircuitResponse,
  UserProfile,
} from '../../domain/models/Profile'

export class ProfileRepositoryImpl implements ProfileRepository {
  async getUser(userId: number): Promise<UserProfile> {
    return profileApi.getUser(userId)
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<UserProfile> {
    return profileApi.updateUser(userId, data)
  }

  async activateCircuit(data: ActivateCircuitRequest): Promise<ActivateCircuitResponse> {
    return profileApi.activateCircuit(data)
  }
}