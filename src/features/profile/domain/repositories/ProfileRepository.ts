import type { UpdateUserRequest }      from '../dtos/request/update-user.request'
import type { ChangePasswordRequest }  from '../dtos/request/change-password.request'
import type { ActivateCircuitRequest } from '../dtos/request/activate-circuit.request'
import type { ChangePasswordResponse } from '../dtos/response/change-password.response'
import type { ActivateCircuitResponse } from '../dtos/response/activate-circuit.response'
import type { UserProfile }            from '../models/UserProfile'

export interface ProfileRepository {
  getUser(userId: number):                                       Promise<UserProfile>
  updateUser(userId: number, data: UpdateUserRequest):           Promise<UserProfile>
  changePassword(data: ChangePasswordRequest):                   Promise<ChangePasswordResponse>
  uploadProfileImage(file: File):                                Promise<{ profile_image: string }>
  activateCircuit(data: ActivateCircuitRequest):                 Promise<ActivateCircuitResponse>
}
