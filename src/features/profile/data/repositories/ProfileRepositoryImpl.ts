import { profileApi } from '../api/profileApi'
import type { ProfileRepository } from '../../domain/repositories/ProfileRepository'
import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ActivateCircuitRequest,
  ActivateCircuitResponse,
  UserProfile,
} from '../../domain/models/Profile'

export class ProfileRepositoryImpl implements ProfileRepository {
  async getUser(userId: number): Promise<UserProfile> {
    return profileApi.getUser(userId)
  }

  async uploadProfileImage(file: File): Promise<{ profile_image: string }> {
    return profileApi.uploadProfileImage(file)
  }

  async updateUser(userId: number, data: UpdateUserRequest): Promise<UserProfile> {
    return profileApi.updateUser(userId, data)
  }

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return profileApi.changePassword(data)
  }

  async activateCircuit(data: ActivateCircuitRequest): Promise<ActivateCircuitResponse> {
    return profileApi.activateCircuit(data)
  }
}