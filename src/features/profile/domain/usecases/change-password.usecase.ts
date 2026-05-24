import type { ProfileRepository }    from '../repositories/ProfileRepository'
import type { ChangePasswordRequest } from '../dtos/request/change-password.request'
import type { ChangePasswordResponse } from '../dtos/response/change-password.response'

export class ChangePasswordUseCase {
  private readonly repository: ProfileRepository

  constructor(repository: ProfileRepository) {
    this.repository = repository
  }

  execute(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return this.repository.changePassword(data)
  }
}
