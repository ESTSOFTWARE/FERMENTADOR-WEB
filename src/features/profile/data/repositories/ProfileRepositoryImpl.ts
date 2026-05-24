import { profileApi }                   from '../api/profileApi'
import type { ProfileRepository }       from '../../domain/repositories/ProfileRepository'
import type { UpdateUserRequest }       from '../../domain/dtos/request/update-user.request'
import type { ChangePasswordRequest }   from '../../domain/dtos/request/change-password.request'
import type { ActivateCircuitRequest }  from '../../domain/dtos/request/activate-circuit.request'
import type { ChangePasswordResponse }  from '../../domain/dtos/response/change-password.response'
import type { ActivateCircuitResponse } from '../../domain/dtos/response/activate-circuit.response'
import type { UserProfile }             from '../../domain/models/UserProfile'

export class ProfileRepositoryImpl implements ProfileRepository {
  getUser(userId: number):                                      Promise<UserProfile>            { return profileApi.getUser(userId) }
  uploadProfileImage(file: File):                               Promise<{ profile_image: string }> { return profileApi.uploadProfileImage(file) }
  updateUser(userId: number, data: UpdateUserRequest):          Promise<UserProfile>            { return profileApi.updateUser(userId, data) }
  changePassword(data: ChangePasswordRequest):                  Promise<ChangePasswordResponse> { return profileApi.changePassword(data) }
  activateCircuit(data: ActivateCircuitRequest):                Promise<ActivateCircuitResponse>{ return profileApi.activateCircuit(data) }
  markTourCompleted():                                          Promise<{ message: string }>    { return profileApi.markTourCompleted() }
}
