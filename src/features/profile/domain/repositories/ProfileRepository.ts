import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ActivateCircuitRequest,
  ActivateCircuitResponse,
  UserProfile,
} from '../models/Profile'

export interface ProfileRepository {
  getUser(userId: number): Promise<UserProfile>
  updateUser(userId: number, data: UpdateUserRequest): Promise<UserProfile>
  changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse>
  uploadProfileImage(file: File): Promise<{ profile_image: string }>
  activateCircuit(data: ActivateCircuitRequest): Promise<ActivateCircuitResponse>
}